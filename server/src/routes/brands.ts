import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { getBrandsSuggestUseCase } from "../usecases/brands/getBrandsSuggest.js";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";

const router = Router();

// GET /brands/suggest?keyword=""
// summary: ブランドサジェスト検索リスト取得
// page: /upload
router.get("/suggest", async (req: Request, res: Response): Promise<void> => {
    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);

    if (!keyword) {
        res.status(200).json({ suggest: [] });
        return;
    }

    try {
        const brands = await getBrandsSuggestUseCase({ keyword });

        res.status(200).json({ brands });
    } catch (err) {
        console.error(err);
        res.status(500).json({ suggest: [] });
    }
});

export default router;
