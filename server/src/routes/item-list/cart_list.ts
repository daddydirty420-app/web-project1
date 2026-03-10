import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../../middleware/index.js";
import { Op } from "sequelize";
import { Cart, Item, Sale, Video } from "../../models/index.js";
import { normalizeJapanese } from "../../utils/normalizeJapanese.js";

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {    
    const currentUserId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    try {
        const cartList = await Cart.findAll({
            attributes: ["id"],
            where: { addtocart_user_id: currentUserId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Item,
                    where: { status: "active" },
                    attributes: ['id', 'name', 'price', "status", 'seller_id', 'first_image_url', "gender_type", "age_type"],
                    required: true,
                    include: [
                        {
                            model: Sale,
                            attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                            required: false,
                        },
                        {
                            model: Video,
                            attributes: ["title"],
                        },
                    ],
                },
            ],
        });

        if (!cartList) {
            res.status(404).json({ message: 'カートの商品が見つかりません。'});
            return;
        }
        
        const itemList = cartList
        .map((cart: typeof Cart) => cart.Item);
        
        const totalCount = await Cart.count({
            where: { addtocart_user_id: currentUserId },
            include: [
                {
                    model: Item,
                    where: { status: "active" },
                    required: true,
                },
            ],
        });
        
        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/search', authenticateToken, async (req: Request, res: Response): Promise<void> => {    
    const currentUserId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);
    if (!keyword) {
        res.status(400).json({ message: "検索キーワードがありません" });
        return;
    }
    
    try {
        const cartList = await Cart.findAll({
            attributes: ["id"],
            where: { addtocart_user_id: currentUserId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Item,
                    where: {
                        status: "active",
                        search_text: { [Op.iLike]: `%${keyword}%` },
                    },
                    attributes: ['id', 'name', 'price', "status", 'seller_id', 'first_image_url', "gender_type", "age_type"],
                    required: true,
                    include: [
                        {
                            model: Sale,
                            attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                            required: false,
                        },
                        {
                            model: Video,
                            attributes: ["title"],
                        },
                    ],
                },
            ],
        });

        if (!cartList) {
            res.status(404).json({ message: 'カートの商品が見つかりません。'});
            return;
        }
        
        const itemList = cartList
        .map((cart: typeof Cart) => cart.Item);
        
        const totalCount = await Cart.count({
            where: { addtocart_user_id: currentUserId },
            include: [
                {
                    model: Item,
                    where: {
                        status: "active",
                        search_text: { [Op.iLike]: `%${keyword}%` },
                    },
                    required: true,
                },
            ],
        });
        
        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

export default router;