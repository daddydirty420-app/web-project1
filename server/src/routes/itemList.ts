import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateOptional } from "../middleware/index.js";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";
import { getItemList } from "../services/item/itemList/itemList.service.js";
import { ItemListType } from "../services/item/itemList/itemList.config.js";

const router = Router();

// /items?type="typename"(&page=number&keyword="search")

router.get("/", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;

    const type = req.query.type as ItemListType;

    if (!type) {
        res.status(400).json({ message: "ページタイプクエリが不正です" });
        return;
    }

    const page = parseInt(req.query.page as string) || 1;

    const statusQuery = req.query.status as string | undefined;

    const statusList = statusQuery
    ? statusQuery.split(",")
    : undefined;
        
    const rawKeyword = req.query.keyword as string | undefined;

    const keyword = rawKeyword
    ? normalizeJapanese(rawKeyword)
    : undefined;

    try {
        const result = await getItemList({
            type,
            page,
            userId,
            statusList,
            keyword,
        });

        res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;