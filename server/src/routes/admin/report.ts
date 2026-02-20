import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { ItemReport, Item, ItemReportOption, CommentReport, CommentReportOption, Comment, ItemBuyerReport, User, ItemBuyerReportOption, PaidInfo, Video } from "../../models/index.js";
import { col, fn, literal } from "sequelize";

const router = Router();

router.get('/item/report-all', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'uploaded_at', [fn('COUNT', col('ItemReports.id')), 'report_count']],
            include: [
                {
                    model: Video,
                    attributes: ['play_count'],
                    required: false
                },
                {
                    model: ItemReport,
                    attributes: ["id"],
                    required: true
                }
            ],
            group: ['Item.id', 'Video.id'],
            order: [
                [literal('report_count'), 'DESC'],
                [col('Video.play_count'), 'DESC'],
                ['uploaded_date', 'DESC']
            ],
            subQuery: false,
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

router.get('/comment/report-all', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const commentList = await Comment.findAll({
            attributes: ['id', 'text', [fn('COUNT', col('CommentReports.id')), 'report_count']],
            include: [
                {
                    model: CommentReport,
                    attributes: ['id'],
                    required: true
                }
            ],
            group: ['Comment.id'],
            order: [
                [literal('report_count'), 'DESC'],
                ['createdAt', 'DESC']
            ],
            subQuery: false
        });

        if (!commentList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(commentList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/item/report-list/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        const reportList = await ItemReport.findAll({
            where: { item_id: itemId },
            order: [['createdAt', 'DESC']],
            include: [
                { model: ItemReportOption },
                {
                    model: Item,
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!reportList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ reportList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/comment/report-list/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.id;

    try {
        const reportList = await CommentReport.findAll({
            where: { comment_id: commentId },
            order: [['createdAt', 'DESC']],
            include: [
                { model: CommentReportOption },
                {
                    model: Comment,
                    attributes: ['id', 'text'],
                },
            ],
        });

        if (!reportList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ reportList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/buyer/report-list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
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
});

export default router;