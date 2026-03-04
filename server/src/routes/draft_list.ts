import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Op, literal, WhereOptions } from "sequelize";
import { Item, User, Video, Sale, Search, Categories } from "../models/index.js";
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

router.patch("/search/:id", async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
            const item = await Item.findByPk(itemId, {
                include: [
                    { model: Video },
                    {
                        model: Categories,
                        as: "Category",
                        include: [
                            {
                                model: Categories,
                                as: "parent",
                                required: false,
                            },
                        ],
                    },
                    { model: User },
                ],
            });
            if (!item) {
                res.status(404).json({ message: "itemが見つかりません。" });
                return;
            }

        const searchText = `
        ${item.name}
        ${item.Video?.title ?? ""}
        ${item.Category?.name ?? ""}
        ${item.Category?.parent?.name ?? ""}
        ${item.User?.user_name ?? ""}
        `;

        const normalizeSearchText = normalizeJapanese(searchText ?? "");

        await item.update({
            search_text: normalizeSearchText,
        });

        res.status(200).json({ message: "成功" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

export default router;