import { Router, Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { authenticateToken } from "../middleware/index.js";
import { Delivery, ShippingDayOption, ShippingServiceOption,  TodouhukenOption, PaidInfo, Item, ColorSize, User, SizeShoesOption, SizeWearOption,  Address, Name } from "../models/index.js";

const router = Router();

router.get('/index-wait-item-list', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user!.id;

        const data = await Delivery.findAll({
            attributes: ['id'],
            where: { buyer_user_id: currentUserId, cancel: false, delivery_status_id: { [Op.ne]: 4 } },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', [Sequelize.literal(`"Item"."image_url"[1]`), 'first_image_url']]
                },
                {
                    model: PaidInfo,
                    attributes: ['id']
                }
            ]
        });

        if (!data) {
            res.status(404).json({ error: 'アイテムが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/buy-color-size/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Delivery.findByPk(req.params.id, {
            attributes: ['id'],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', [Sequelize.literal(`"Item"."image_url"[1]`), 'first_image_url'], 'price']
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['user_name']
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size', 'stock_now', 'image_url'],
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

router.get('/buy-trans/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Delivery.findByPk(req.params.id, {
            attributes: ['id', 'buyer_phone_number'],
            include: [
                {
                    model: Address,
                    attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building'],
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
                },
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
                    model: Item,
                    attributes: ['id', 'name', 'price', 'stock_now', [Sequelize.literal(`"Item"."image_url"[1]`), 'first_image_url']]
                },
                {
                    model: ColorSize,
                    attributes: ['kind', 'color', 'size', 'stock_now'],
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
                    attributes: ['user_name']
                }
            ]
        });

        if (!data || data.length === 0) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/delivery-phone/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Delivery.findByPk(req.params.id, {
            attributes: ['id', 'buyer_phone_number']
        });

        if (!data) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;