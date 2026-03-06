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
        const goodList = await GoodItem.findAll({
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

        if (!goodList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const itemList = goodList.map((good: typeof GoodItem) => good.Item);

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

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/search', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);
    if (!keyword) {
        res.status(400).json({ message: "検索キーワードがありません" });
        return;
    }

    try {
        const goodList = await GoodItem.findAll({
            attributes: ["id"],
            where: { good_user_id: currentUserId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Item,
                    as: "item",
                    where: {
                        status: { [Op.in]: ["active", "soldout"] },
                        search_text: { [Op.iLike]: `%${keyword}%` },
                    },
                    attributes: ['id', 'name', 'price', "status", 'seller_id', 'first_image_url', "gender_type", "age_type"],
                    required: true,
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

        if (!goodList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const itemList = goodList.map((good: typeof GoodItem) => good.item);

        const totalCount = await GoodItem.count({
            where: { good_user_id: currentUserId },
            include: [
                {
                    model: Item,
                    where: {
                        status: { [Op.in]: ["active", "soldout"] },
                        search_text: { [Op.iLike]: `%${keyword}%` },
                    },
                },
            ],
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

export default router;