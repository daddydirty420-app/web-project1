import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../../../middleware/index.js";
import { normalizeJapanese } from "../../../utils/normalizeJapanese.js";
import { getItems } from "../../../services/item/userItems/items.service.js";
import { ItemListType } from "../../../services/item/userItems/items.service.js";

const router = Router();

// /items?type="typename"(&page=number&status=""&keyword="search")

router.get("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;

    const type = req.query.type as ItemListType;

    if (!type) {
        res.status(400).json({ message: "タイプクエリが不正です" });
        return;
    }

    const page = parseInt(req.query.page as string) || 1;

    const status = req.query.status as string | undefined;
        
    const rawKeyword = req.query.keyword as string | undefined;

    const keyword = rawKeyword
    ? normalizeJapanese(rawKeyword)
    : undefined;

    try {
        const { itemList, totalPages } = await getItems({
            type,
            page,
            userId,
            status,
            keyword,
        });

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;