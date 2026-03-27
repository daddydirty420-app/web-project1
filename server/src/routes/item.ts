import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Item } from "../models/index.js";

const router = Router();

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