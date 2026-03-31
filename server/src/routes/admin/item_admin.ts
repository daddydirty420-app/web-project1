import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Item, Video } from "../../models/index.js";
import adminDeleteItem from "../../services/adminDeleteItem.js";

const router = Router();

router.delete('/delete-item/:id', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    if (isNaN(itemId)) {
        res.status(400).json({ message: "itemIdが不正な値です。" });
        return;
    }

    const adminId = req.user!.id;

    const deleteReason = req.body.deleteReason;

    if (!deleteReason || deleteReason === "") {
        res.status(400).json({ message: "deleteReasonが不正な値です。" });
        return;
    }

    try {
        await adminDeleteItem(itemId, adminId, deleteReason);
        
        res.status(200).json({ message: "商品を削除しました。" });
    } catch (err) {
        next(err);
    }
});

router.get('/file-edit-page/:id', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const item = await Item.findByPk(req.params.id, {
            attributes: ['id', 'name', 'image_url', 'sold_out'],
            include: [
                {
                    model: Video,
                    attributes: ['id', 'original_url', 'converted_url', 'thumbnail_url', 'title'],
                },
            ],
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json({ item });
    } catch (err) {
        next(err);
    }
});

export default router;