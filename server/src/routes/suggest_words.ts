import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { getSuggestWordsRateLimit } from "../middleware/rateLimit/suggestWordsRateLimit.js";
import { validateQuery } from "../middleware/validate/validateQuery.js";
import { getSuggestUseCase } from "../usecases/suggestWords/getSuggest.js";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";
import { KeywordOptionalQuery, keywordOptionalQuerySchema } from "../validators/query/keyword.js";

const router = Router();

// GET /suggest-words?keyword
// summary: 検索サジェスト一覧取得
// page: header
router.get(
    "/",
    getSuggestWordsRateLimit,
    validateQuery(keywordOptionalQuerySchema),
    async (req: Request, res: Response): Promise<void> => {
        const query = req.validatedQuery as KeywordOptionalQuery;
        const keyword = normalizeJapanese(query.keyword ?? "");

        if (!keyword.trim()) {
            res.status(200).json({ suggest: [] });
            return;
        }

        try {
            const suggest = await getSuggestUseCase({ keyword });

            res.status(200).json({ suggest });
        } catch (err) {
            console.error(err);
            res.status(500).json({ suggest: [] });
        }
    },
);

export default router;
