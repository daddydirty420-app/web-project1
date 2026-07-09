import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { subDays } from "date-fns";
import { Op } from "sequelize";
import { PointLots, User } from "../models/index.js";

const router = Router();

router.get(
    "/admin/180",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const halfYearAgo = subDays(new Date(), 180);

            const pointsList = await PointLots.findAll({
                where: {
                    createdAt: { [Op.lt]: halfYearAgo },
                },
                order: [["createdAt", "ASC"]],
                include: [
                    {
                        model: User,
                        attributes: ["id", "user_name", "email"],
                    },
                ],
            });

            const totalPoints = await PointLots.sum("points", {
                where: {
                    createdAt: { [Op.lt]: halfYearAgo },
                },
            });

            res.json({
                pointsList,
                totalPoints,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
