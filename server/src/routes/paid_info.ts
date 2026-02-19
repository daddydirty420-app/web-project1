import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Op } from "sequelize";
import { PaidInfo, PaymentMethodOption, Item, User, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, Address, Name, Chat, ShopInfo, DeliveryStatusOption, Cancel, Sale, Categories } from "../models/index.js";

const router = Router();

router.get('/buy/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await PaidInfo.findByPk(req.params.id, {
            attributes: ['id', 'price', 'total_amount', 'item_count', "purchase_snapshot"],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id', 'buyer_phone_number', 'arrive_specified_date'],
                    include: [
                        { model: ShippingDayOption },
                        { model: ShippingServiceOption },
                        {
                            model: TodouhukenOption,
                            as: 'DeliveryTodouhuken',
                        },
                        {
                            model: Address,
                            attributes: ["id", 'post_number', 'shikutyouson', 'banchi', 'building'],
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: 'AddressTodouhuken',
                                },
                            ],
                        },
                        {
                            model: Name,
                            attributes: ['sei', 'mei'],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'user_name'],
                },
                {
                    model: User,
                    as: 'Buyer',
                    attributes: ['id', 'points'],
                },
            ],
        });

        if (!data || data.length === 0) {
            res.status(404).json({ message: 'データを取得できません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/buy-item-after/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await PaidInfo.findByPk(req.params.id, {
            attributes: ['id', "unit_price", "subtotal_amount", "discount_amount", 'total_amount', 'points_used', "paid_amount", 'item_count', 'buy_at', "paid_at", "status", 'pay_id', "purchase_snapshot"],
            include: [
                {
                    model: PaymentMethodOption,
                    required: false,
                },
                {
                    model: Chat,
                    required: false,
                    attributes: ['seller_username', 'seller_chat', 'buyer_username', 'buyer_chat', 'createdAt', 'updatedAt'],
                },
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                    include: [
                        {
                            model: Categories,
                            as: "children",
                            required: false,
                            innclude: [
                                {
                                    model: Categories,
                                    as: "parent",
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'user_name', 'profile_image', 'verified', 'star_amount', 'star_average'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                            required: false,
                        },
                    ],
                },
                {
                    model: Delivery,
                    attributes: ['id', 'buyer_phone_number', 'shipping_at', 'arrived_at', 'arrive_specified_date'],
                    include: [
                        { model: ShippingDayOption },
                        { model: DeliveryStatusOption },
                        {
                            model: Address,
                            attributes: ["id", 'post_number', 'shikutyouson', 'banchi', 'building'],
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: 'AddressTodouhuken',
                                },
                            ],
                        },
                        {
                            model: Name,
                            attributes: ['sei', 'mei'],
                        },
                    ],
                },
                {
                    model: Cancel,
                    required: false,
                    attributes: ['id', 'cancel_flag'],
                },
            ],
        });

        if (!data || data.length === 0) {
            res.status(404).json({ message: 'データを取得できません。' });
            return;
        }

        const item = data.Item;
        const itemId = item?.id ?? null;
        const currentUserId = req.user?.id ?? null;

        const baseCategory = item.Categories;

        const targetParentId = baseCategory.parent_id ?? baseCategory.id;

        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', 'first_image_url'],
            where: {
                status: "active",
                id: { [Op.ne]: itemId },
                seller_id: { [Op.ne]: currentUserId },
            },
            order: [['sort_number', 'DESC']],
            limit: 20,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag'],
                },
                {
                    model: Categories,
                    where: {
                        [Op.or]: [
                            { parent_id: targetParentId },
                            { id: targetParentId },
                        ],
                    },
                    attributes: ['id'],
                    required: true,
                },
            ]
        });

        if (!itemList) {
            res.status(404).json({ message: '商品リストを取得できません。' });
            return;
        }

        res.json({ data, itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/cancel-page/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await PaidInfo.findByPk(req.params.id, {
            attributes: ['id', 'total_amount', 'item_count'],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'user_name', 'profile_image', 'verified'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                        },
                    ],
                },
            ],
        });

        if (!data || data.length === 0) {
            res.status(404).json({ message: 'データを取得できません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/item-transport/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await PaidInfo.findByPk(req.params.id, {
            attributes: ['id', "unit_price", "subtotal_amount", "discount_amount", 'total_amount', 'item_count', 'buy_at', "paid_at", 'paid_ok', "status", 'pay_id', 'sales_commission_amount', 'gain_amount', "purchase_snapshot"],
            include: [
                {
                    model: Chat,
                    required: false,
                    attributes: ['seller_username', 'seller_chat', 'buyer_username', 'buyer_chat', 'createdAt', 'updatedAt'],
                },
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: User,
                    as: 'Buyer',
                    attributes: ['id', 'user_name', 'profile_image', 'verified'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                            required: false,
                        },
                    ],
                },
                {
                    model: Delivery,
                    attributes: ['id', 'buyer_phone_number', 'shipping_at', 'arrived_at', 'arrive_specified_date'],
                    include: [
                        { model: ShippingDayOption },
                        { model: DeliveryStatusOption },
                        {
                            model: Address,
                            attributes: ["id", 'post_number', 'shikutyouson', 'banchi', 'building'],
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: 'AddressTodouhuken',
                                },
                            ],
                        },
                        {
                            model: Name,
                            attributes: ['sei', 'mei'],
                        },
                    ],
                },
                {
                    model: Cancel,
                    required: false,
                    attributes: ['id', 'cancel_flag', 'cancel_reason', 'item_count'],
                },
            ],
        });

        if (!data || data.length === 0) {
            res.status(404).json({ message: 'データを取得できません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;