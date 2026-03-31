import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { Op } from "sequelize";
import { Journal, JournalReasonOption } from "../models/index.js";
import { subDays } from "date-fns";

const router = Router();

router.get('/admin/list', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(String(startDate)) : subDays(new Date(), 7);
        const end = endDate ? new Date(String(endDate)) : new Date();

        const dataList = await Journal.findAll({
            where: {
                createdAt: {
                    [Op.between]: [start, end]
                }
            },
            order: [['createdAt', 'DESC']],
            include: [
                { model: JournalReasonOption },
            ]
        });

        res.json({ dataList });
    } catch (err) {
        next(err);
    }
});

export default router;