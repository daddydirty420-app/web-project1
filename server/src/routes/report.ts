import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ItemReport, Item, ItemReportOption, CommentReportOption, ItemBuyerReportOption, User, CommentReport } from "../models/index.js";
import sequelize from "../db.js";

const router = Router();

router.post("/item/report-create/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = req.user!.id;
    const selectedOptionId = Number(req.body.selected);

    if (Number.isNaN(itemId) || Number.isNaN(selectedOptionId)) {
        res.status(400).json({ message: "不正なidです" });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const reportOption = await ItemReportOption.findByPk(selectedOptionId);
        if (!reportOption) {
            res.status(404).json({ message: "選択した内容が見つかりません" });
            return;
        }

        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: "商品が見つかりません" });
            return;
        }

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーデータが見つかりません" });
            return;
        }

        await ItemReport.create({
            item_id: itemId,
            report_user_id: userId,
            option_id: selectedOptionId,
        }, { transaction: t });

        await item.update({
            report_score: Number(item.report_score) + Number(user.report_trust_score),
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "報告を作成しました" });
    } catch (err) {
        await t.rollback();
        next(err);
    }
});

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

router.get('/item/all-options', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await ItemReportOption.findAll();
        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

router.get('/comment/all-options', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await CommentReportOption.findAll();
        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

router.get('/buyer/all-options', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await ItemBuyerReportOption.findAll();
        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

export default router;