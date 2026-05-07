import { subDays } from "date-fns";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { BankAccount, UriagekinHistory, User } from "../models/index.js";

const router = Router();

router.get(
    "/admin/180",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const halfYearAgo = subDays(new Date(), 180);

            const uriagekinList = await UriagekinHistory.findAll({
                where: {
                    createdAt: { [Op.lt]: halfYearAgo },
                },
                order: [["createdAt", "ASC"]],
                include: [
                    {
                        model: User,
                        attributes: ["id", "user_name", "email"],
                        include: [
                            {
                                model: BankAccount,
                                attributes: ["id"],
                            },
                        ],
                    },
                ],
            });

            const totalUriagekin = uriagekinList.reduce((sum: number, data: any) => {
                return sum + (data.uriagekin || 0);
            }, 0);

            res.json({
                uriagekinList,
                totalUriagekin,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
