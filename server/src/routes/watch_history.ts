import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { WatchHistory, Item, Sale } from "../models/index.js";

const router = Router();

router.delete("/remove/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = req.user!.id;

    try {
        const data = await WatchHistory.findOne({
            where: {
                item_id: itemId,
                user_id: userId,
            },
        });

        if (!data) {
            res.status(404).json({ message: "閲覧履歴が見つかりません" });
            return;
        }

        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        await data.destroy();

        res.status(200).json({ message: "閲覧履歴を削除しました" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;