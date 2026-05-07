import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op, col, fn, literal } from "sequelize";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Item, ReferenceCode, User } from "../../models/index.js";

const router = Router();

router.get(
    "/input-list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const inputList = await ReferenceCode.findAll({
                attributes: ["id", "input", "input_user_id", "createdAt"],
                where: {
                    input: { [Op.ne]: null },
                },
                include: [
                    {
                        model: User,
                        as: "InputUser",
                        attributes: [
                            "id",
                            "user_name",
                            "email",
                            [fn("COALESCE", fn("COUNT", col("InputUser->Items.id")), 0), "item_count"],
                        ],
                        include: [
                            {
                                model: Item,
                                attributes: ["id"],
                                required: false,
                            },
                        ],
                    },
                ],
                group: ["ReferenceCode.id", "InputUser.id"],
                order: [
                    [literal('"InputUser.item_count"'), "DESC"],
                    ["createdAt", "ASC"],
                ],
                subQuery: false,
            });

            const allUser = await User.findAll();

            const campaignPointsSum = allUser.reduce((sum: number, user: InstanceType<typeof User>) => {
                return sum + (user.campaign_points_sum || 0);
            }, 0);

            res.json({
                inputList,
                campaignPointsSum,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/output-data",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const outputData = await ReferenceCode.findOne({
                attributes: ["id", "output", "output_user_id", "createdAt"],
                where: { output: req.query.input },
                include: [
                    {
                        model: User,
                        as: "OutputUser",
                        attributes: [
                            "id",
                            "user_name",
                            "email",
                            [fn("COALESCE", fn("COUNT", col("OutputUser->Items.id")), 0), "item_count"],
                        ],
                        include: [
                            {
                                model: Item,
                                attributes: ["id"],
                                required: false,
                            },
                        ],
                    },
                ],
                group: ["ReferenceCode.id", "OutputUser.id"],
                subQuery: false,
            });

            if (!outputData) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json({ outputData });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
