import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Op, literal, WhereOptions } from "sequelize";
import { Item, User, Video, Sale, Search } from "../models/index.js";
import { normalizeJapanese } from "utils/normalizeJapanese.js";
import { getItemList } from "services/item/itemList.js";

const router = Router();

// /items?type="typename"(&page=number&keyword="search")

router.get("/", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;

    const type = req.query.type as string;
    const page = parseInt(req.query.page as string) || 1;
        
    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);

    try {
        const result = await getItemList({
            type,
            page,
            userId,
        });

        res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;