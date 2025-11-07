import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { Op } from "sequelize";
import { PointsHistory, User } from "../models/index.js";
import { subDays } from "date-fns";

const router = Router();

router.get('/admin/180', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const halfYearAgo = subDays(new Date(), 180);

        const pointsList = await PointsHistory.findAll({
            where: {
                createdAt: {
                    [Op.lt]: halfYearAgo
                }
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                }
            ]
        });

        const totalPoints = await PointsHistory.sum("points", {
            where: {
                createdAt: { [Op.lt]: halfYearAgo },
            },
        });

        if (!pointsList || !totalPoints) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json({
            pointsList,
            totalPoints
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;