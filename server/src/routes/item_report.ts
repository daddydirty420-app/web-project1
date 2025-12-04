import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { ItemReport, Item, ItemReportOption } from "../models/index.js";

const router = Router();

router.get('/all-options', async (req: Request, res: Response): Promise<void> => {
    try {
        const options = await ItemReportOption.findAll();
        res.json(options);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/admin/report-list/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const reportList = await ItemReport.findAll({
            where: { item_id: req.params.id },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: ItemReportOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Item,
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!reportList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(reportList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;