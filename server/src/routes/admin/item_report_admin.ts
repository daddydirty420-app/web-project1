import { Router, Request, Response } from "express";
import { fn, col, literal } from "sequelize";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Item, Video, ItemReport, ItemReportOption } from "../../models/index.js";

const router = Router();

router.get('/report-all', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'uploaded_date', [fn('COUNT', col('ItemReports.id')), 'report_count']],
            include: [
                {
                    model: Video,
                    attributes: ['play_count'],
                    required: false
                },
                {
                    model: ItemReport,
                    attributes: [],
                    required: true
                }
            ],
            group: ['Item.id', 'Video.id'],
            order: [
                [literal('report_count'), 'DESC'],
                [col('Video.play_count'), 'DESC'],
                ['uploaded_date', 'DESC']
            ],
            subQuery: false
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

router.get('/report-list/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
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
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(reportList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;