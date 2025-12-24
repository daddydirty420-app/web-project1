import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional, isAdmin } from "../middleware/index.js";
import { Op, Sequelize } from "sequelize";
import { ReccomendItem, Item, User, Sale, Video } from "../models/index.js";
import { subDays } from "date-fns";

const router = Router();

router.get('/reccomend-item-list', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user?.id ?? null;

        const data = await ReccomendItem.findAll({
            attributes: ['id'],
            where: {
                user_id: { [Op.ne]: currentUserId },
            },
            limit: 20,
            order: [[Sequelize.col('Item.sort_number'), 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'price', 'first_image_url'],
                    where: { status: "active" },
                    required: true,
                    include: [
                        {
                            model: Sale,
                            attributes: ['discount_rate', 'discount_amount', 'sale_flag'],
                        },
                    ],
                },
            ],
        });

        if (!data) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/admin/reccomend-item-list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const sevenDaysAgo = subDays(new Date(), 7);

        const itemList = await ReccomendItem.findAll({
            attributes: ['id'],
            where: { createdAt: { [Op.gte]: sevenDaysAgo } },
            order: [[Sequelize.col('Item.uploaded_at'), 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', "status", 'uploaded_at', 'first_image_url'],
                    where: { status: "active" },
                    required: true,
                    include: [
                        {
                            model: Video,
                            attributes: ['id', 'video_url', 'thumbnail_url', 'title'],
                        },
                        {
                            model: User,
                            attributes: ['id', 'user_name', 'email'],
                        },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;