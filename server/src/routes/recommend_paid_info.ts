import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { RecommendPaidInfo, User } from "../models/index.js";

const router = Router();

router.get('/receipt/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await RecommendPaidInfo.findByPk(req.params.id, {
            attributes: ['id', 'price', 'pay_id', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['user_name'],
                },
            ],
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/paid-history', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await RecommendPaidInfo.findAll({
            attributes: ['id', 'createdAt'],
            where: { user_id: req.user!.id },
            order: [['createdAt', 'DESC']],
        });

        if (!dataList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ dataList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;