import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Item, User, ItemConditionOption, GoodItem, Video, Sale, ShippingDayOption, ShippingServiceOption, TodouhukenOption, ShopInfo, ItemReport, Comment, ItemShippingProfile, Categories, Brands } from "../../models/index.js";

const router = Router();

router.get('/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId, {
            attributes: {
                exclude: ['sort_number', 'views_count', 'checked', 'createdAt', 'search_text']
            },
            include: [
                { model: ItemConditionOption },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                        }
                    ],
                },
                {
                    model: Video,
                    attributes: ['id', 'thumbnail_url', 'title', 'summary', 'duration', 'play_count', 'original_url', 'converted_url'],
                },
                {
                    model: Sale,
                    attributes: ['id', 'before_price', 'discount_rate', 'discount_amount', 'sale_flag'],
                },
                {
                    model: ItemShippingProfile,
                    include: [
                        { model: ShippingDayOption },
                        { model: ShippingServiceOption },
                        { model: TodouhukenOption },
                    ],
                },
                {
                    model: Categories,
                    as: "Category",
                    include: [
                        {
                            model: Categories,
                            attributes: ["id", "name", "level", "parent_id", "allowed_gender", "allowed_age"],
                            as: "children",
                            required: false,
                        },
                        {
                            model: Categories,
                            attributes: ["id", "name", "level", "allowed_gender", "allowed_age"],
                            as: "parent",
                            required: false,
                        },
                    ],
                },
                {
                    model: Brands,
                    as: "brand",
                    required: false,
                },
            ],
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const goodCount = await GoodItem.count({
            where: { item_id: itemId },
        });

        const commentCount = await Comment.count({
            where: { item_id: itemId },
        });

        const reportCount = await ItemReport.count({
            where: { item_id: itemId },
        });

        res.json({ item, goodCount, commentCount, reportCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;