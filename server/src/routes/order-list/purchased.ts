import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../../middleware/index.js";
import { Op } from "sequelize";
import { PaidInfo, Delivery, DeliveryStatusOption } from "../../models/index.js";

const router = Router();

router.get('/all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const paidList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count', "point_used", "buy_at", "purchase_snapshot"],
            where: {
                buyer_user_id: userId,
                status: { [Op.ne]: "pending" },
            },
            order: [['buy_at', 'DESC']],
            limit,
            offset,
            include: [
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

        const totalCount = await PaidInfo.count({
            where: {
                seller_user_id: userId,
                status: { [Op.ne]: "pending" },
            },
            include: [
                {
                    model: Delivery,
                    required: true,
                },
            ],
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ paidList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/waiting', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const paidList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count', "point_used", "buy_at", "purchase_snapshot"],
            where: {
                buyer_user_id: userId,
                status: "paid",
            },
            order: [['buy_at', 'DESC']],
            limit,
            offset,
            include: [
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

        const totalCount = await PaidInfo.count({
            where: {
                seller_user_id: userId,
                status: { [Op.ne]: "pending" },
            },
            include: [
                {
                    model: Delivery,
                    required: true,
                },
            ],
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ paidList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/shipping', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const paidList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count', "point_used", "buy_at", "purchase_snapshot"],
            where: {
                buyer_user_id: userId,
                status: "shipped",
            },
            order: [['buy_at', 'DESC']],
            limit,
            offset,
            include: [
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

        const totalCount = await PaidInfo.count({
            where: {
                seller_user_id: userId,
                status: { [Op.ne]: "pending" },
            },
            include: [
                {
                    model: Delivery,
                    required: true,
                },
            ],
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ paidList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/complete', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const paidList = await PaidInfo.findAll({
            attributes: ['id', 'total_amount', 'buy_at', 'item_count', "point_used", "buy_at", "purchase_snapshot"],
            where: {
                buyer_user_id: userId,
                status: "completed",
            },
            order: [['buy_at', 'DESC']],
            limit,
            offset,
            include: [
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

        const totalCount = await PaidInfo.count({
            where: {
                seller_user_id: userId,
                status: { [Op.ne]: "pending" },
            },
            include: [
                {
                    model: Delivery,
                    required: true,
                },
            ],
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ paidList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;