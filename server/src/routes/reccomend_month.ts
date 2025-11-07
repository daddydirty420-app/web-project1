import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { Op, fn, col } from "sequelize";
import { ReccomendMonth, User, UriagekinHistory } from "../models/index.js";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

const router = Router();

router.get('/admin/pay-list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
        const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

        const baseInclude = (plan_id: number) => ({
            where: {
                plan_id,
                paid: false,
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email', [fn('COALESCE', fn('SUM', col('User.UriagekinHistories.uriagekin')), 0), 'monthly_uriagekin']],
                    include: [
                        {
                            model: UriagekinHistory,
                            attributes: [],
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
                'ReccomendMonth.id',
                'User.id'
            ],
            subQuery: false
        });

        const basicList = await ReccomendMonth.findAll(baseInclude(1));
        const plusList = await ReccomendMonth.findAll(baseInclude(2));

        if (!basicList || !plusList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({
            basicList,
            plusList
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;