import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Op } from "sequelize";
import { PaidInfo, Item, Delivery, DeliveryStatusOption } from "../models/index.js";

const router = Router();

router.get('/purchased-item-all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count'],
            where: {
                buyer_user_id: req.user!.id,
                status: { [Op.ne]: "pending" },
            },
            order: [['buy_at', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        { model: DeliveryStatusOption },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/purchased-item-trading', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count'],
            where: {
                buyer_user_id: req.user!.id,
                status: { [Op.in]: ["paid", "shipped"] },
            },
            order: [['buy_at', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        { model: DeliveryStatusOption },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});
router.get('/purchased-item-finish', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count'],
            where: {
                buyer_user_id: req.user!.id,
                status: "completed",
            },
            order: [['buy_at', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        { model: DeliveryStatusOption },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                status: { [Op.ne]: "pending" },
            },
            order: [['buy_at', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    include: [
                        { model: DeliveryStatusOption },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-pre-trans', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                status: "paid",
            },
            order: [['buy_at', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    required: true,
                    include: [
                        { model: DeliveryStatusOption },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-now-trans', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                status: "shipped",
            },
            order: [['buy_at', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    required: true,
                    include: [
                        { model: DeliveryStatusOption },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold-item-finish', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count'],
            where: {
                seller_user_id: req.user!.id,
                status: "completed",
            },
            order: [['buy_at', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'first_image_url'],
                },
                {
                    model: Delivery,
                    attributes: ['id'],
                    required: true,
                    include: [
                        { model: DeliveryStatusOption },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;