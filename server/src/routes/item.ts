import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Item, ItemDeleteLogs } from "../models/index.js";

const router = Router();

router.delete("/draft/remove/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = Number(req.user!.id);

    try {
        const item = await Item.findByPk(itemId);

        if (!item) {
            res.status(404).json({ message: "商品が見つかりません" });
            return;
        }

        if (item.seller_id !== userId || item.status !== "draft") {
            res.status(400).json({ message: "不正なアクセスが検出されました" });
            return;
        }

        await item.destroy();

        res.status(200).json({ message: "下書き商品を削除しました" });
    } catch (err) {
        next(err);
    }
});

router.get('/upload-ok/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId, {
            attributes: ['id', 'name', 'price', "attributes", 'first_image_url', "gender_type", "age_type", "seller_id", "status"],
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
});

export default router;