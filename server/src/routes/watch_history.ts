import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { WatchHistory, Item, Sale } from "../models/index.js";

const router = Router();

router.get('/watch-item-list', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await WatchHistory.findAll({
            attributes: [],
            where: { user_id: req.user!.id },
            limit: 20,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'price', 'sold_out', 'first_image_url'],
                    where: { public: true },
                    required: false,
                    include: [
                        {
                            model: Sale,
                            attributes: ['discount_amount', 'discount_rate', 'sale_flag'],
                            required: false
                        }
                    ]
                }
            ]
        });

        if (!data) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;