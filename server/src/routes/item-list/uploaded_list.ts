import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../../middleware/index.js";
import { Op } from "sequelize";
import { Item, Sale, Video } from "../../models/index.js";
import { normalizeJapanese } from "../../utils/normalizeJapanese.js";

const router = Router();

router.get('/all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", "seller_id", 'first_image_url', "gender_type", "age_type"],
            where: { 
                seller_id: currentUserId,
                status: { [Op.in]: ["active", "hidden", "soldout"] },
            },
            order: [['uploaded_at', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                },
                {
                    model: Video,
                    attributes: ['title'],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const totalCount = await Item.count({
            where: {
                seller_id: currentUserId,
                status: { [Op.in]: ["active", "hidden", "soldout"] },
            },
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/selling', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", "seller_id", 'first_image_url', "gender_type", "age_type"],
            where: { 
                seller_id: currentUserId,
                status: "active",
            },
            order: [['uploaded_at', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                },
                {
                    model: Video,
                    attributes: ['title'],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const totalCount = await Item.count({
            where: {
                seller_id: currentUserId,
                status: "active",
            },
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/selling', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
        
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", "seller_id", 'first_image_url', "gender_type", "age_type"],
            where: { 
                seller_id: currentUserId,
                status: "soldout",
            },
            order: [['uploaded_at', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                },
                {
                    model: Video,
                    attributes: ['title'],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const totalCount = await Item.count({
            where: {
                seller_id: currentUserId,
                status: "soldout",
            },
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/all/search', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", "seller_id", 'first_image_url', "gender_type", "age_type"],
            where: { 
                seller_id: currentUserId,
                status: { [Op.in]: ["active", "hidden", "soldout"] },
                search_text: { [Op.iLike]: `%${keyword}%` },
            },
            order: [['uploaded_at', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                },
                {
                    model: Video,
                    attributes: ['title'],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const totalCount = await Item.count({
            where: {
                seller_id: currentUserId,
                status: { [Op.in]: ["active", "hidden", "soldout"] },
                search_text: { [Op.iLike]: `%${keyword}%` },
            },
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/selling/search', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", "seller_id", 'first_image_url', "gender_type", "age_type"],
            where: { 
                seller_id: currentUserId,
                status: "active",
                search_text: { [Op.iLike]: `%${keyword}%` },
            },
            order: [['uploaded_at', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                },
                {
                    model: Video,
                    attributes: ['title'],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const totalCount = await Item.count({
            where: {
                seller_id: currentUserId,
                status: "active",
                search_text: { [Op.iLike]: `%${keyword}%` },
            },
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/sold/search', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", "seller_id", 'first_image_url', "gender_type", "age_type"],
            where: { 
                seller_id: currentUserId,
                status: "soldout",
                search_text: { [Op.iLike]: `%${keyword}%` },
            },
            order: [['uploaded_at', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Sale,
                    attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                },
                {
                    model: Video,
                    attributes: ['title'],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const totalCount = await Item.count({
            where: {
                seller_id: currentUserId,
                status: "soldout",
                search_text: { [Op.iLike]: `%${keyword}%` },
            },
        });

        const totalPages = Math.floor(totalCount / 20);

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;