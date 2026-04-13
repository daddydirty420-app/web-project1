import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ItemReport, Item, ItemReportOption, User } from "../models/index.js";
import sequelize from "../db.js";
import { getItemReportOptions } from "../services/itemReport.js";

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

router.get('/all-options', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await getItemReportOptions();

        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

export default router;