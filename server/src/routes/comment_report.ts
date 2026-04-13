import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Item, CommentReportOption, User, CommentReport } from "../models/index.js";
import sequelize from "../db.js";
import { getCommentReportOptions } from "../services/commentReport.js";

const router = Router();

router.post("/comment/report-create/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);
    const userId = req.user!.id;
    const selectedOptionId = Number(req.body.selected);

    if (Number.isNaN(commentId) || Number.isNaN(selectedOptionId)) {
        res.status(400).json({ message: "不正なidです" });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const reportOption = await CommentReportOption.findByPk(selectedOptionId);
        if (!reportOption) {
            res.status(404).json({ message: "選択した内容が見つかりません" });
            return;
        }

        const comment = await Item.findByPk(commentId);
        if (!comment) {
            res.status(404).json({ message: "コメントが見つかりません" });
            return;
        }

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーデータが見つかりません" });
            return;
        }

        await CommentReport.create({
            comment_id: commentId,
            report_user_id: userId,
            option_id: selectedOptionId,
        }, { transaction: t });

        await comment.update({
            report_score: Number(comment.report_score) + Number(user.report_trust_score),
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "報告を作成しました" });
    } catch (err) {
        await t.rollback();
        next(err);
    }
});

router.get('/all-options', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await getCommentReportOptions();

        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

export default router;