import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { validateQuery } from "../middleware/validate/validateQuery.js";
import { searchBanksUseCase } from "../usecases/banks/search.js";
import { KeywordQuery, keywordQuerySchema } from "../validators/query/keyword.js";
import { bankSearchRateLimit } from "../middleware/rateLimit/bankAccountRateLimit.js";

const router = Router();

// GET /banks/search?keyword=""
// summary: 銀行検索
// page: /edit/accountなど
router.get(
    "/search",
    validateQuery(keywordQuerySchema),
    bankSearchRateLimit,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const query = req.validatedQuery as KeywordQuery;

        try {
            const matchedBanks = await searchBanksUseCase({ kw: query.keyword });

            res.status(200).json({ banks: matchedBanks });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
