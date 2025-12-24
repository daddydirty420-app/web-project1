import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { ItemBuyerReport, Item, User, ItemBuyerReportOption, PaidInfo } from "../models/index.js";

const router = Router();

router.get('/buy-item-after/bad-click', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const options = await ItemBuyerReportOption.findAll();
        res.json({ options });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/admin/report-list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await ItemBuyerReport.findAll({
            where: { checked: false },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email'],
                },
                {
                    model: Item,
                    attributes: ['id', 'name'],
                },
                { model: ItemBuyerReportOption },
                {
                    model: PaidInfo,
                    attributes: ['id', 'total_amount', 'sales_commission_amount', 'gain_amount', 'status'],
                    include: [
                        {
                            model: User,
                            as: 'Seller',
                            attributes: ['id', 'user_name', 'email'],
                        },
                    ],
                },
            ],
        });

        if (!dataList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ dataList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
})

export default router;