import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Op, literal } from "sequelize";
import { Item, User, Video, Sale, Search } from "../models/index.js";

const router = Router();

router.get(
    "/item-money-management/item-list/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const itemId = req.params.id;
            const currentUserId = req.user!.id;

            const itemList = await Item.findAll({
                attributes: ["id", "name", "price", "status", "uploaded_at", "first_image_url"],
                where: {
                    seller_id: currentUserId,
                    status: { [Op.in]: ["active", "hidden", "soldout"] },
                    id: { [Op.ne]: itemId },
                },
                order: [["uploaded_at", "DESC"]],
                include: [
                    {
                        model: Sale,
                        attributes: ["discount_rate", "discount_amount", "sale_flag"],
                    },
                ],
            });

            res.json({ itemList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/money-management/item-list",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user!.id;

            const itemList = await Item.findAll({
                attributes: ["id", "name", "price", "status", "uploaded_at", "first_image_url"],
                where: {
                    seller_id: currentUserId,
                    status: { [Op.in]: ["active", "hidden", "soldout"] },
                },
                order: [["uploaded_at", "DESC"]],
                include: [
                    {
                        model: Sale,
                        attributes: ["discount_rate", "discount_amount", "sale_flag"],
                    },
                ],
            });

            res.json({ itemList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/search/video-list",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user?.id ?? null;

            const page = parseInt(req.query.page as string) || 1;
            const limit = 12;
            const offset = (page - 1) * limit;

            const searchId = req.query.search_id;

            let latestSearch;

            if (searchId) {
                latestSearch = await Search.findOne({
                    where: {
                        id: searchId,
                        user_id: currentUserId,
                    },
                });
            } else {
                latestSearch = await Search.findOne({
                    where: {
                        user_id: currentUserId,
                        search_text: { [Op.ne]: null },
                    },
                    order: [["createdAt", "DESC"]],
                });
            }

            const searchWord = latestSearch?.search_text || "";

            const escapeWord = searchWord.replace(/'/g, "''");

            const itemList = await Item.findAll({
                attributes: [
                    "id",
                    "name",
                    "price",
                    "status",
                    "search_text",
                    "sort_number",
                    [
                        literal(`(
                    sort_number * (
                    SELECT COUNT(*) FROM regexp_matches(search_text, '${escapeWord}', 'gi')
                    )
                    )`),
                        "score",
                    ],
                ],
                where: {
                    seller_id: { [Op.ne]: currentUserId },
                    status: { [Op.in]: ["active", "soldout"] },
                    search_text: { [Op.iLike]: `%${searchWord}%` },
                },
                order: [
                    [
                        literal(`(
                    sort_number * (
                    SELECT COUNT(*) FROM regexp_matches(search_text, '${escapeWord}', 'gi')
                    )
                    )`),
                        "DESC",
                    ],
                ],
                limit,
                offset,
                include: [
                    {
                        model: Video,
                        attributes: ["thumbnail_url", "duration", "title"],
                    },
                    {
                        model: Sale,
                        attributes: ["sale_flag", "before_price", "discount_rate", "discount_amount"],
                    },
                    {
                        model: User,
                        attributes: ["user_name", "profile_image"],
                    },
                ],
            });

            res.json({ itemList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/search/item-list",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user?.id ?? null;

            const page = parseInt(req.query.page as string) || 1;
            const limit = Number(req.query.limit) || 18;
            const offset = (page - 1) * limit;

            const searchId = req.query.search_id;

            let latestSearch;

            if (searchId) {
                latestSearch = await Search.findOne({
                    where: {
                        id: searchId,
                        user_id: currentUserId,
                    },
                });
            } else {
                latestSearch = await Search.findOne({
                    where: {
                        user_id: currentUserId,
                        search_text: { [Op.ne]: null },
                    },
                    order: [["createdAt", "DESC"]],
                });
            }

            const searchWord = latestSearch?.search_text || "";

            const escapeWord = searchWord.replace(/'/g, "''");

            const itemList = await Item.findAll({
                attributes: [
                    "id",
                    "name",
                    "price",
                    "status",
                    "search_text",
                    "first_image_url",
                    "sort_number",
                    [
                        literal(`(
                    sort_number * (
                    SELECT COUNT(*) FROM regexp_matches(search_text, '${escapeWord}', 'gi')
                    )
                    )`),
                        "score",
                    ],
                ],
                where: {
                    seller_id: { [Op.ne]: currentUserId },
                    status: { [Op.in]: ["active", "soldout"] },
                    search_text: { [Op.iLike]: `%${searchWord}%` },
                },
                order: [
                    [
                        literal(`(
                    sort_number * (
                    SELECT COUNT(*) FROM regexp_matches(search_text, '${escapeWord}', 'gi')
                    )
                    )`),
                        "DESC",
                    ],
                ],
                limit,
                offset,
                include: [
                    {
                        model: Sale,
                        attributes: ["sale_flag", "discount_rate", "discount_amount"],
                    },
                ],
            });

            res.json({ itemList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/search2/video-list",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user?.id ?? null;

            const page = parseInt(req.query.page as string) || 1;
            const limit = 12;
            const offset = (page - 1) * limit;

            const searchId = req.query.search_id;

            if (!searchId) {
                res.status(400).json({ message: "search_idが指定されていません。" });
                return;
            }

            const search = await Search.findOne({
                where: { id: searchId },
            });

            if (!search) {
                res.status(404).json({ message: "検索情報が見つかりません。" });
                return;
            }

            const categoryText = search.category_text;
            let categoryCondition = {};

            const parts = categoryText.split(" - ").map((p: string) => p?.trim());

            if (parts.length === 1) {
                categoryCondition = {
                    category_text: { [Op.iLike]: `%${parts[0]}%` },
                };
            } else {
                categoryCondition = { category_text: categoryText };
            }

            const itemList = await Item.findAll({
                attributes: ["id", "name", "price", "status", "sort_number"],
                where: {
                    seller_id: { [Op.ne]: currentUserId },
                    status: { [Op.in]: ["active", "soldout"] },
                    ...categoryCondition,
                },
                order: [["sort_number", "DESC"]],
                limit,
                offset,
                include: [
                    {
                        model: Video,
                        attributes: ["thumbnail_url", "duration", "title"],
                    },
                    {
                        model: Sale,
                        attributes: ["sale_flag", "before_price", "discount_rate", "discount_amount"],
                    },
                    {
                        model: User,
                        attributes: ["user_name", "profile_image"],
                    },
                ],
            });

            res.json({ itemList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/search2/item-list",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user?.id ?? null;

            const page = parseInt(req.query.page as string) || 1;
            const limit = Number(req.query.limit) || 18;
            const offset = (page - 1) * limit;

            const searchId = req.query.search_id;

            if (!searchId) {
                res.status(400).json({ message: "search_idが指定されていません 。" });
                return;
            }

            const search = await Search.findOne({
                where: { id: searchId },
            });

            if (!search) {
                res.status(404).json({ message: "検索情報が見つかりません。" });
                return;
            }

            const categoryText = search.category_text;
            let categoryCondition = {};

            const parts = categoryText.split(" - ").map((p: string) => p?.trim());

            if (parts.length === 1) {
                categoryCondition = {
                    category_text: { [Op.iLike]: `%${parts[0]}%` },
                };
            } else {
                categoryCondition = { category_text: categoryText };
            }

            const itemList = await Item.findAll({
                attributes: ["id", "name", "price", "status", "sort_number", "first_image_url"],
                where: {
                    seller_id: { [Op.ne]: currentUserId },
                    status: { [Op.in]: ["active", "soldout"] },
                    ...categoryCondition,
                },
                order: [["sort_number", "DESC"]],
                limit,
                offset,
                include: [
                    {
                        model: Sale,
                        attributes: ["sale_flag", "discount_rate", "discount_amount"],
                    },
                ],
            });

            res.json({ itemList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
