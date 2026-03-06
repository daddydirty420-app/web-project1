import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../../middleware/index.js";
import { Op } from "sequelize";
import { GoodItem, Item, Video } from "../../models/index.js";
import { normalizeJapanese } from "../../utils/normalizeJapanese.js";

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const itemList = await GoodItem.findAll({
            attributes: ["id"],
            where: { good_user_id: currentUserId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Item,
                    where: {
                        status: { [Op.in]: ["active", "soldout"] },
                    },
                    attributes: ['id', 'name', 'price', "status", 'seller_id', 'first_image_url', "gender_type", "age_type"],
                    required: false,
                    include: [
                        {
                            model: Video,
                            attributes: ["title"],
                            required: false,
                        },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const totalCount = await GoodItem.count({
            where: { good_user_id: currentUserId },
            include: [
                {
                    model: Item,
                    where: {
                        status: { [Op.in]: ["active", "soldout"] },
                    },
                },
            ],
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});