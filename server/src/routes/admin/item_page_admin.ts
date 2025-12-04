import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Item, User, ItemConditionOption, GoodItem, Video, Sale, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, ShopInfo, ReccomendItem, ColorSize, SizeOption, SizeWearOption, SizeShoesOption, Category, ItemReport, Comment } from "../../models/index.js";

const router = Router();

router.get('/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId, {
            attributes: {
                exclude: ['sort_number', 'views_count', 'views_24h', 'checked', 'createdAt', 'search_text']
            },
            include: [
                { model: ItemConditionOption, attributes: ['name'] },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id']
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
                    model: Delivery,
                    as: 'ParentDelivery',
                    attributes: ['id', 'parent_data'],
                    where: { parent_data: true },
                    required: false,
                    include: [
                        {
                            model: ShippingDayOption,
                            attributes: ['name']
                        },
                        {
                            model: ShippingServiceOption,
                            attributes: ['name']
                        },
                        {
                            model: TodouhukenOption,
                            as: 'DeliveryTodouhuken',
                            attributes: ['name']
                        }
                    ],
                },
                {
                    model: ReccomendItem,
                    attributes: ['id']
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size', 'image_url', 'stock_all', 'stock_now'],
                    include: [
                        {
                            model: SizeOption,
                            attributes: ['name']
                        },
                        {
                            model: SizeShoesOption,
                            attributes: ['name']
                        },
                        {
                            model: SizeWearOption,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: Category,
                    attributes: ['id', 'category1_id'],
                },
            ]
        });

        if (!item || !item.public || item.deleted) {
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