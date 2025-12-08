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

router.get('/cart-list', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    type CartInstance = InstanceType<typeof Cart>;
    type ItemInstance = InstanceType<typeof Item>;
    
    try {
        const currentUserId = req.user!.id;
        const cartList = await Cart.findAll({
            where: { addtocart_user_id: currentUserId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'price', 'first_image_url']
                }
            ]
        }) as (CartInstance & { Item?: ItemInstance})[];

        if (!cartList) {
            res.status(404).json({ message: 'カートの商品が見つかりません。'});
            return;
        }

        const cartItemIds = cartList.map(cart => cart.Item?.id).filter(id => id !== undefined);

        const relatedItemList = await Item.findAll({
            attributes: ['id', 'name', 'price', 'first_image_url'],
            where: {
                public: true,
                sold_out: false,
                seller_id: { [Op.ne]: currentUserId },
                id: { [Op.notIn]: cartItemIds }
            },
            limit: 20,
            order: [['sort_number', 'DESC']],
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag']
                }
            ]
        });

        res.json({ cartList, relatedItemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

export default router;