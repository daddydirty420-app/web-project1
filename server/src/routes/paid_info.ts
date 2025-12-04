import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Op, literal } from "sequelize";
import { PaidInfo, PaymentMethodOption, Item, ColorSize, User, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, Address, Name, SizeShoesOption, SizeWearOption, Chat, ShopInfo, DeliveryStatusOption, Cancel, Sale, ReccomendItem } from "../models/index.js";

const router = Router();

router.get('/buy/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await PaidInfo.findByPk(req.params.id, {
            attributes: ['id', 'price', 'total_amount', 'item_count'],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size'],
                    include: [
                        {
                            model: SizeShoesOption,
                            attributes: ['id','name']
                        },
                        {
                            model: SizeWearOption,
                            attributes: ['id','name']
                        }
                    ]
                },
                {
                    model: Delivery,
                    attributes: ['id', 'buyer_phone_number', 'arrive_specified_date'],
                    include: [
                        {
                            model: ShippingDayOption,
                            attributes: ['id','name']
                        },
                        {
                            model: ShippingServiceOption,
                            attributes: ['id','name']
                        },
                        {
                            model: TodouhukenOption,
                            as: 'DeliveryTodouhuken',
                            attributes: ['id','name']
                        },
                        {
                            model: Address,
                            attributes: ['post_number', 'shikutyouson', 'banchi', 'building'],
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: 'AddressTodouhuken',
                                    attributes: ['id','name']
                                }
                            ]
                        },
                        {
                            model: Name,
                            attributes: ['sei', 'mei', 'middle_name']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'user_name']
                },
                {
                    model: User,
                    as: 'Buyer',
                    attributes: ['id', 'points']
                }
            ]
        });

        if (!data || data.length === 0) {
            res.status(404).json({ error: 'データを取得できません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/buy-item-after/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await PaidInfo.findByPk(req.params.id, {
            attributes: ['id', 'total_amount', 'points_used', 'item_count', 'buy_date', 'paid_ok', 'cancel', 'return_item', 'pay_id', [literal('"total_amount" - "points_used"'), 'cash_amount']],
            include: [
                {
                    model: PaymentMethodOption,
                    required: false,
                    attributes: ['name']
                },
                {
                    model: Chat,
                    required: false,
                    attributes: ['seller_username', 'seller_chat', 'buyer_username', 'buyer_chat', 'createdAt', 'updatedAt']
                },
                {
                    model: Item,
                    attributes: ['id', 'name', 'category_text', 'first_image_url']
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size'],
                    required: false,
                    include: [
                        {
                            model: SizeShoesOption,
                            attributes: ['id','name']
                        },
                        {
                            model: SizeWearOption,
                            attributes: ['id','name']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'user_name', 'profile_image', 'verified', 'star_amount', 'star_average'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                            required: false
                        }
                    ]
                },
                {
                    model: Delivery,
                    attributes: ['id', 'buyer_phone_number', 'shipping_date', 'arrived_date', 'arrive_specified_date'],
                    include: [
                        {
                            model: ShippingDayOption,
                            attributes: ['id','name']
                        },
                        {
                            model: DeliveryStatusOption,
                            attributes: ['id','name']
                        },
                        {
                            model: Address,
                            attributes: ['post_number', 'shikutyouson', 'banchi', 'building'],
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: 'AddressTodouhuken',
                                    attributes: ['id','name']
                                }
                            ]
                        },
                        {
                            model: Name,
                            attributes: ['sei', 'mei', 'middle_name']
                        }
                    ]
                },
                {
                    model: Cancel,
                    required: false,
                    attributes: ['id', 'cancel_flag']
                }
            ]
        });

        if (!data || data.length === 0) {
            res.status(404).json({ error: 'データを取得できません。' });
            return;
        }

        const item = data.Item;
        const itemId = item?.id ?? null;
        const categoryText = item?.category_text?.trim() ?? null;
        const currentUserId = req.user?.id ?? null;

        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', 'first_image_url'],
            where: {
                public: true,
                sold_out: false,
                id: { [Op.ne]: itemId },
                seller_id: { [Op.ne]: currentUserId },
                category_text: { [Op.iLike]: `%${categoryText}%` }
            },
            order: [['sort_number', 'DESC']],
            limit: 20,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag']
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ error: '商品リストを取得できません。' });
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
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'user_name', 'profile_image', 'verified'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id']
                        }
                    ]
                }
            ]
        });

        if (!data || data.length === 0) {
            res.status(404).json({ error: 'データを取得できません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/item-transport/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await PaidInfo.findByPk(req.params.id, {
            attributes: ['id', 'total_amount', 'item_count', 'buy_date', 'paid_ok', 'cancel', 'return_item', 'pay_id', 'sales_commission_amount', 'gain_amount', 'price'],
            include: [
                {
                    model: Chat,
                    required: false,
                    attributes: ['seller_username', 'seller_chat', 'buyer_username', 'buyer_chat', 'createdAt', 'updatedAt']
                },
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                    include: [
                        {
                            model: ReccomendItem,
                            attributes: ['id', 'plus', 'reccomend_month']
                        }
                    ]
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size'],
                    required: false,
                    include: [
                        {
                            model: SizeShoesOption,
                            attributes: ['id','name']
                        },
                        {
                            model: SizeWearOption,
                            attributes: ['id','name']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'Buyer',
                    attributes: ['id', 'user_name', 'profile_image', 'verified'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                            required: false
                        }
                    ]
                },
                {
                    model: Delivery,
                    attributes: ['id', 'buyer_phone_number', 'shipping_date', 'arrived_date', 'arrive_specified_date'],
                    include: [
                        {
                            model: ShippingDayOption,
                            attributes: ['id','name']
                        },
                        {
                            model: DeliveryStatusOption,
                            attributes: ['id','name']
                        },
                        {
                            model: Address,
                            attributes: ['post_number', 'shikutyouson', 'banchi', 'building'],
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: 'AddressTodouhuken',
                                    attributes: ['id','name']
                                }
                            ]
                        },
                        {
                            model: Name,
                            attributes: ['sei', 'mei', 'middle_name']
                        }
                    ]
                },
                {
                    model: Cancel,
                    required: false,
                    attributes: ['id', 'cancel_flag', 'cancel_reason', 'item_count']
                }
            ]
        });

        if (!data || data.length === 0) {
            res.status(404).json({ error: 'データを取得できません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;