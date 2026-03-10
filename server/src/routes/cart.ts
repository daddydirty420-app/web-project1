import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken } from "../middleware/index.js";
import { Cart, Item, Sale } from "../models/index.js";

const router = Router();

router.post('/cart-add', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.query.itemId;

    if (!currentUserId || !itemId) {
        res.status(400).json({ message: 'ユーザーidまたはアイテムidがありません。' });
        return;
    }

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        await Cart.create({
            addtocart_user_id: currentUserId,
            item_id: itemId,
        });

        item.sort_number = Number(item.sort_number) + 250;
        item.sort_buzz_number = Number(item.sort_buzz_number) + 300;
        await item.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.delete("/cart-remove", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.query.itemId;

    if (!currentUserId || !itemId) {
        res.status(400).json({ message: 'ユーザーidまたはアイテムidがありません。' });
        return;
    }

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        await Cart.destroy({
            where: {
                addtocart_user_id: currentUserId,
                item_id: itemId,
            },
        });

        item.sort_number -= Math.max(Number(item.sort_number) - 250, 0);
        item.sort_buzz_number -= Math.max(Number(item.sort_buzz_number) - 300, 0);
        await item.save();

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/cart-status', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.query.itemId;

    if (!currentUserId || !itemId) {
        res.status(400).json({ message: 'ユーザーidまたはアイテムidがありません。' });
        return;
    }

    try {
        const status = await Cart.findOne({
            where: {
                addtocart_user_id: currentUserId,
                item_id: itemId,
            },
        });

        res.status(200).json({ cartIn: !!status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get("/related-item-list", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    try {
        const cartList = await Cart.findAll({
            where: { addtocart_user_id: userId },
            include: [
                {
                    model: Item,
                    where: { status: "active" },
                    required: true,
                },
            ],
        });

        const cartItemIds = cartList.map((cart: typeof Cart) => cart.Item?.id);

        const relatedItemList = await Item.findAll({
            attributes: ['id', 'name', 'price', 'first_image_url', "status"],
            where: {
                status: "active",
                seller_id: { [Op.ne]: userId },
                id: { [Op.notIn]: cartItemIds },
            },
            limit: 20,
            order: [['sort_number', 'DESC']],
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag'],
                },
            ],
        });

        if (!relatedItemList) {
            res.status(404).json({ message: "関連商品リストを取得できません" });
            return;
        }

        res.status(200).json({ message: "関連商品リストを取得しました" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;