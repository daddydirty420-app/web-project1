import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { col, fn, literal, Op } from "sequelize";
import { authenticateToken, isAdmin } from "../../../middleware/index.js";
import { Address, GenderOption, IdCard, Item, Name, ShopInfo, TodouhukenOption, User } from "../../../models/index.js";

const router = Router();

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
