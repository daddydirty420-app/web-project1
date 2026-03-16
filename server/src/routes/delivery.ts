import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op, Sequelize } from "sequelize";
import { authenticateToken } from "../middleware/index.js";
import { Delivery, ShippingDayOption, ShippingServiceOption,  TodouhukenOption, Order, Item, User, Address, Name } from "../models/index.js";

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
                    model: Order,
                    attributes: ['id'],
                },
            ],
        });

        res.json({ data });
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
                        },
                    ],
                },
                {
                    model: Name,
                    attributes: ['sei', 'mei'],
                },
                { model: ShippingDayOption },
                { model: ShippingServiceOption },
                {
                    model: TodouhukenOption,
                    as: 'DeliveryTodouhuken',
                },
                {
                    model: Item,
                    attributes: ['id', 'name', 'price', 'stock_now', [Sequelize.literal(`"Item"."image_url"[1]`), 'first_image_url']]
                },
            ],
        });

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;