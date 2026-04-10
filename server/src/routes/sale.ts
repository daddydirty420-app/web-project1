import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Sale, Item } from "../models/index.js";
import { saleEditUseCase } from "../usecases/sale/saleEdit.js";

const router = Router();

router.patch('/:id/edit', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const saleId = Number(req.params.id);
    if (!saleId) {
        res.status(400).json({ message: "saleIdがありません。" });
        return;
    }
    const { discountRate, discountAmount, finalPrice } = req.body;
    if ( discountRate > 0 && discountAmount > 0) {
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

router.patch('/sale-stop/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const saleId = req.params.id;
    if (!saleId) {
        res.status(400).json({ message: "saleIdがありません。" });
        return;
    }

    try {
        const sale = await Sale.findByPk(saleId);
        if (!sale) {
            res.status(404).json({ message: "Saleが見つかりません。" });
            return;
        }
        const beforePrice = sale.before_price;
        if (!beforePrice || isNaN(beforePrice)) {
            res.status(400).json({ message: "Sale.before_priceの値が不適切です。" });
            return;
        }

        const item = await Item.findByPk(sale.item_id);
        if (!item) {
            res.status(404).json({ message: "商品が見つかりません。" });
            return;
        }

        await sale.update({
            discount_rate: 0,
            discount_amount: 0,
            sale_flag: false,
        });

        await item.update({
            price: beforePrice,
        });

        res.status(200).json({ message: "値引きを終了しました！" });
    } catch (err) {
        next(err);
    }
});

export default router;