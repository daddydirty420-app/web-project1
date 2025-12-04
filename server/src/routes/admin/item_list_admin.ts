import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { User, Item, Video } from "../../models/index.js";
import { subDays } from "date-fns";

const router = Router();

router.get('/check', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'uploaded_date', 'first_item_image'],
            where: {
                public: true,
                checked: false
            },
            order: [['uploaded_date', 'ASC']],
            limit: 30,
            include: [
                {
                    model: Video,
                    attributes: ['id', 'video_url', 'thumbnail_url', 'title']
                },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const twoDaysAgo = subDays(new Date(), 2);

        const itemCount = await Item.count({
            where: {
                public: true,
                checked: false
            }
        });
        const itemCount2d = await Item.count({
            where: {
                public: true,
                checked: false,
                uploaded_date: {
                    [Op.lt]: twoDaysAgo
                }
            }
        });

        res.json({
            itemList,
            itemCount,
            itemCount2d
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;