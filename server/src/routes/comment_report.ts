import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { CommentReport, Comment, CommentReportOption } from "../models/index.js";

const router = Router();

router.get('/all-options', async (req: Request, res: Response): Promise<void> => {
    try {
        const options = await CommentReportOption.findAll();
        res.json({ options });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/admin/report-list/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const reportList = await CommentReport.findAll({
            where: { comment_id: req.params.id },
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

export default router;