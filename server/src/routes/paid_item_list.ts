import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/index.js";
import { Op } from "sequelize";
import { PaidInfo, Item, Delivery, DeliveryStatusOption } from "../models/index.js";

const router = Router();

router.get('/purchased-item-all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_date', 'item_count'],
            where: {
                buyer_user_id: req.user!.id,
                paid_ok: true
            },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        {
                            model: DeliveryStatusOption,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/purchased-item-trading', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_date', 'item_count'],
            where: {
                buyer_user_id: req.user!.id,
                paid_ok: true,
                trans_finish: false
            },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        {
                            model: DeliveryStatusOption,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});
router.get('/purchased-item-finish', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_date', 'item_count'],
            where: {
                buyer_user_id: req.user!.id,
                paid_ok: true,
                trans_finish: true
            },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        {
                            model: DeliveryStatusOption,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_date', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                paid_ok: true
            },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        {
                            model: DeliveryStatusOption,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-pre-trans', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_date', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                paid_ok: true
            },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            model: DeliveryStatusOption,
                            where: { id: 1 },
                            required: true,
                            attributes: ['id', 'name']
                        }
                    ],
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-now-trans', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_date', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                paid_ok: true
            },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            model: DeliveryStatusOption,
                            where: { id: { [Op.in]: [2, 3] } },
                            required: true,
                            attributes: ['id', 'name']
                        }
                    ],
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-finish', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_date', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                paid_ok: true
            },
            order: [['buy_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url']
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            model: DeliveryStatusOption,
                            where: { id: 4 },
                            required: true,
                            attributes: ['id', 'name']
                        }
                    ],
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;