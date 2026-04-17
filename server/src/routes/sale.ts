import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { saleEditUseCase } from "../usecases/sale/saleEdit.js";
import { saleStopUseCase } from "../usecases/sale/saleStop.js";

const router = Router();

// PATCH /sale/:id/edit
router.patch("/:id/edit", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const saleId = Number(req.params.id);
    if (!saleId) {
        res.status(400).json({ message: "saleIdがありません。" });
        return;
    }
    const { discountRate, discountAmount, finalPrice } = req.body;
    if (discountRate > 0 && discountAmount > 0) {
        res.status(400).json({ message: "値引き率、値引き額どちらか一方のみ利用可能です。" });
        return;
    }
    if ((!discountRate || discountRate === 0) && (!discountAmount || discountAmount === 0)) {
        res.status(400).json({ message: "値引き率、値引き額どちらか一方を入力してください。" });
        return;
    }

    try {
        await saleEditUseCase({ saleId, discountRate, discountAmount, finalPrice });

        res.status(200).json({ message: "値引きしました！" });
    } catch (err) {
        next(err);
    }
});

// PATCH /sale/:id/stop
router.patch("/:id/stop", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const saleId = Number(req.params.id);
    if (!saleId) {
        res.status(400).json({ message: "saleIdがありません。" });
        return;
    }

    try {
        await saleStopUseCase({ saleId });

        res.status(200).json({ message: "値引きを終了しました！" });
    } catch (err) {
        next(err);
    }
});

export default router;
