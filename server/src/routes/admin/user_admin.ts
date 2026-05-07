import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op, col, fn, literal } from "sequelize";
import { AppError } from "../../errors.js";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { validateParams } from "../../middleware/validateParams.js";
import { Address, GenderOption, IdCard, Item, Name, ShopInfo, TodouhukenOption, User } from "../../models/index.js";
import { addPenaltyUseCase } from "../../usecases/admin/users/addPenalty.js";
import { deleteUriageUseCase } from "../../usecases/admin/users/deleteUriage.js";
import { deleteUserAdminUseCase } from "../../usecases/admin/users/deleteUser.js";
import { getAdminProfileUseCase } from "../../usecases/admin/users/getProfile.js";
import { idParamSchema } from "../../validators/params/id.js";

const router = Router();

// DELETE /admin/user/:id
// summary: ユーザー強制削除
// page: /profile/admin/[id]
router.delete(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);
        const adminId = req.user!.id;

        const deleteReason = req.body.deleteReason;
        if (!deleteReason.trim()) throw new AppError("INVALID_BODY_EMPTY", 400);

        try {
            await deleteUserAdminUseCase({ pageUserId, adminId, deleteReason });

            res.status(200).json({ message: "ユーザーを削除しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /admin/user/:id/add-penalty
// summary: ペナルティポイント追加
// page: /profile/admin/[id]
router.patch(
    "/:id/add-penalty",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);
        const addPenalty = Number(req.body.addPenalty);

        if (!addPenalty) throw new AppError("INVALID_BODY_EMPTY", 400);

        try {
            await addPenaltyUseCase({ pageUserId, addPenalty });

            res.status(200).json({ message: "ペナルティポイントを追加しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /admin/user/:id/delete-uriage
// summary: 売上金没収
// page: /profile/admin/[id]
router.patch(
    "/:id/delete-uriage",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);

        const deleteUriage = Number(req.body.deleteUriage);
        if (!deleteUriage) throw new AppError("INVALID_BODY_EMPTY", 400);

        try {
            await deleteUriageUseCase({ pageUserId, deleteUriage });

            res.status(200).json({
                message: "売上金没収処理が完了しました",
                deleteUriage,
            });
        } catch (err) {
            next(err);
        }
    },
);

// GET /admin/user/:id/profile
// summary: 管理者用プロフィールページ データ取得
// page: /profile/admin/[id]
router.get(
    "/:id/profile",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);

        try {
            const user = await getAdminProfileUseCase({ pageUserId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/verify",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: ["id", "user_name", "birthday", "phone_number", "verify_request", "verified", "email"],
                where: {
                    verify_request: true,
                    verified: false,
                },
                order: [["updatedAt", "ASC"]],
                include: [
                    {
                        model: Address,
                        attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: Name,
                        attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    },
                    { model: GenderOption },
                    {
                        model: IdCard,
                        attributes: ["id", "id_card_front", "id_card_rear"],
                    },
                ],
            });

            const userCount = userList.length;

            res.json({
                userList,
                userCount,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/penalty-list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: ["id", "user_name", "profile_image", "email", "penalty_points", "verified"],
                order: [
                    ["penalty_points", "DESC"],
                    ["createdAt", "ASC"],
                ],
                limit: 30,
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/penalty-search-list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const keyword = req.body.keyword;

            const userList = await User.findAll({
                attributes: ["id", "user_name", "profile_image", "email", "penalty_points", "verified"],
                where: {
                    user_name: { [Op.iLike]: `%${keyword}%` },
                },
                order: [
                    ["penalty_points", "DESC"],
                    ["createdAt", "ASC"],
                ],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/points-give-list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: [
                    "id",
                    "user_name",
                    "email",
                    "campaign_points_sum",
                    [fn("COUNT", col("Items.id")), "item_count"],
                ],
                include: [
                    {
                        model: Item,
                        attributes: ["id"],
                        required: true,
                    },
                ],
                group: ["User.id"],
                order: [
                    [literal("item_count"), "DESC"],
                    ["createdAt", "ASC"],
                ],
            });

            const campaignPointsSum = userList.reduce((sum: number, user: InstanceType<typeof User>) => {
                return sum + (user.campaign_points_sum || 0);
            }, 0);

            res.json({
                userList,
                campaignPointsSum,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/search-user-all",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: ["id", "user_name", "email", "profile_image", "verified", "early_seller", "createdAt"],
                order: [["createdAt", "DESC"]],
                limit: 30,
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/search-user",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const keyword = req.query.keyword;

        try {
            const userList = await User.findAll({
                attributes: ["id", "user_name", "email", "profile_image", "verified", "early_seller", "createdAt"],
                where: {
                    user_name: { [Op.iLike]: `%${keyword}%` },
                },
                order: [["createdAt", "DESC"]],
                limit: 30,
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
