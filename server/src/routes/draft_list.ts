import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Op, literal, WhereOptions } from "sequelize";
import { Item, User, Video, Sale, Search } from "../models/index.js";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";
import sequelize from "../db.js";

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;

    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", 'seller_id', 'save_at', 'first_image_url', "gender_type", "age_type"],
            where: {
                seller_id: currentUserId,
                status: "draft",
            },
            order: [['save_at', 'DESC']],
            include: [
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

        res.status(200).json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/search', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;

    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);
    if (!keyword) {
        res.status(400).json({ message: "検索キーワードがありません" });
        return;
    }

    try {
        const itemList = await Item.findAll({
            attributes: ['id', 'name', 'price', "status", 'seller_id', 'save_at', 'first_image_url', "gender_type", "age_type"],
            where: {
                seller_id: currentUserId,
                status: "draft",
                search_text: { [Op.iLike]: `%${keyword}%` },
            },
            order: [['save_at', 'DESC']],
            include: [
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

        res.status(200).json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.patch("/search-text", async (req: Request, res: Response): Promise<void> => {
    const t = await sequelize.transaction();
    try {
        const items = await Item.findAll();

        if (!items) {
            throw new Error("Item見つからない");
        }

        await Promise.all(items.map(async (item: typeof Item) => {
            const searchText = normalizeJapanese(item.search_text);

            await item.update({
                search_text: searchText,
            }, { transaction: t });
        }));

        await t.commit();

        console.log("search_text更新");

        res.status(200).json({ message: "更新しました" });
    } catch (err) {
        await t.rollback();
        console.log("search_text更新失敗：", err);
    }
});

export default router;