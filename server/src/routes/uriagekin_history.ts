import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getUriagekinHistoryRateLimit } from "../middleware/rateLimit/uriagekinHistory.js";
import { validateQuery } from "../middleware/validate/validateQuery.js";
import { GetUriagekinHistoryQuery, getUriagekinHistoryQuerySchema } from "../validators/query/uriagekinHistory.js";

const router = Router();

// GET /uriagekin-history?limit=number(&cursor="")
// summary: 売上金履歴取得
// page: /history/uriagekin
router.get(
    "/",
    getUriagekinHistoryRateLimit,
    authenticateToken,
    validateQuery(getUriagekinHistoryQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const query = req.validatedQuery as GetUriagekinHistoryQuery;

        const { limit, cursor } = query;
    },
);

export default router;
