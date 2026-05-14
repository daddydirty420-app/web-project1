import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getSearchHistoryRateLimit } from "../middleware/rateLimit/searchRateLimit.js";
import { getSearchHistoryUseCase } from "../usecases/search/getSearchHistory.js";

const router = Router();

// GET /search/history
// summary: 検索履歴取得
// page: header
router.get(
    "/history",
    getSearchHistoryRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user!.id;

        try {
            const sortedData = await getSearchHistoryUseCase({ userId });

            res.status(200).json({ sortedData });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
