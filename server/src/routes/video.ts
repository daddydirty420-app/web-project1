import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateOptional } from "../middleware/index.js";
import { Video, Item } from "../models/index.js";

const router = Router();

router.patch('/onplay/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user?.id ?? null;
    try {
        const videoData = await Video.findByPk(req.params.id);
        if (!videoData) {
            res.status(404).json({ message: `videoデータが見つかりません。id:${req.params.id}` });
            return;
        }

        videoData.play_count += 1;
        await videoData.save();

        const item = await Item.findOne({
            where: { id: videoData.item_id },
        });
        if (!item) {
            res.status(404).json({ message: '商品データが見つかりません。' });
            return;
        }

        if (currentUserId && !item.sold_out) {
            item.sort_number = Number(item.sort_number) + 15;
            item.sort_buzz_number = Number(item.sort_buzz_number) + 70;
            await item.save();
        }

        res.status(200).json({ message: '再生回数追加成功！' });
    } catch (err) {
        next(err);
    }
});

export default router;