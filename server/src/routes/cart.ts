import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Cart } from "../models/index.js";
import { deleteCart } from "../services/cart/delete.service.js";
import { addCart } from "../services/cart/add.service.js";
import { cartStatus } from "../services/cart/status.service.js";

const router = Router();

router.post('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await addCart({ itemId, userId });

        res.status(200).json({ message: "カートに追加しました" });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteCart({ itemId, userId });

        res.status(200).json({ message: "カートから削除しました" });
    } catch (err) {
        next(err);
    }
});

router.get('/:id/status', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        const status = await cartStatus({ itemId, userId });

        res.status(200).json({ status });
    } catch (err) {
        next(err);
    }
});

export default router;