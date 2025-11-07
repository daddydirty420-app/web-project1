import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/index.js";
import { Sale, Item } from "../models/index.js";

const router = Router();

router.post('/sale-edit/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const saleId = req.params.id;
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
        const sale = await Sale.findByPk(saleId);
        if (!sale) {
            res.status(404).json({ message: "Saleが見つかりません。" });
            return;
        }
        const item = await Item.findByPk(sale.item_id);
        if (!item) {
            res.status(404).json({ message: "商品が見つかりません。" });
            return;
        }

        await sale.update({
            discount_rate: discountRate,
            discount_amount: discountAmount,
            sale_flag: true,
        });

        await item.update({
            price: finalPrice,
        });

        res.status(200).json({ message: "値引きしました！" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.post('/sale-stop/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

export default router;