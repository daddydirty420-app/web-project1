import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateOptional } from "../middleware/index.js";
import { ItemListView } from "../services/item/openItems/items.config.js";
import { getOpenItems } from "../services/item/openItems/items.service.js";
import { ReccomendItemsview } from "../services/item/recommend/items.config.js";
import { getRecommendItems } from "../services/item/recommend/items.service.js";

const router = Router();

// /items?type=""&page=number&view=""&limit=number(&pageUserId=${id})

router.get("/", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;

    const type = req.query.type;

    if (!(type === "video" || type === "item")) {
        res.status(400).json({ message: "タイプクエリが不正です" });
        return;
    }

    const page = parseInt(req.query.page as string) || 1;

    const view = req.query.view as ItemListView;

    const limit = parseInt(req.query.limit as string) || 6;

    const pageUserId = parseInt(req.query.pageUserId as string) || undefined;

    try {
        const { items, totalPages } = await getOpenItems({
            userId,
            type,
            page,
            view,
            limit,
            pageUserId,
        });

        res.status(200).json({ items, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// /items/recommend?view=""(&itemId=number)
router.get("/recommend", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;

    const view = req.query.view as ReccomendItemsview;

    const itemId = parseInt(req.query.itemId as string) || undefined;

    try {
        const items = await getRecommendItems({
            userId,
            view,
            itemId,
        });

        res.status(200).json({ items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;