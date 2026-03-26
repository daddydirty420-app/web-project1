import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken } from "../middleware/index.js";
import { Cart, Item, Sale } from "../models/index.js";

const router = Router();

router.post('/add/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        await Cart.create({
            user_id: currentUserId,
            item_id: itemId,
        });

        item.sort_number = Number(item.sort_number) + 250;
        item.sort_buzz_number = Number(item.sort_buzz_number) + 300;
        await item.save();

        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.delete("/remove/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        await Cart.destroy({
            where: {
                user_id : currentUserId,
                item_id: itemId,
            },
        });

        item.sort_number -= Math.max(Number(item.sort_number) - 250, 0);
        item.sort_buzz_number -= Math.max(Number(item.sort_buzz_number) - 300, 0);
        await item.save();

        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.get('/status/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.params.id;

    try {
        const status = await Cart.findOne({
            where: {
                user_id: currentUserId,
                item_id: itemId,
            },
        });

        res.status(200).json({ cartIn: !!status });
    } catch (err) {
        next(err);
    }
});

export default router;