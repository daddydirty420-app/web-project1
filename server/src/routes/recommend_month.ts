import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { Op, fn, col } from "sequelize";
import { RecommendMonth, User, UriagekinHistory } from "../models/index.js";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

const router = Router();

router.get('/admin/pay-list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
        const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

        const list = await RecommendMonth.findAll({
            where: { paid: false },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email', [fn('COALESCE', fn('SUM', col('User.UriagekinHistories.uriagekin')), 0), 'monthly_uriagekin']],
                    include: [
                        {
                            model: UriagekinHistory,
                            attributes: ["id"],
                            where: {
                                createdAt: {
                                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                                }
                            },
                            required: false
                        }
                    ]
                }
            ],
            group: [
                'RecommendMonth.id',
                'User.id'
            ],
            subQuery: false
        });

        if (!list) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;