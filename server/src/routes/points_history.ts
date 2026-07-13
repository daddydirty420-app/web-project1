import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getPointsHistoryRateLimit } from "../middleware/rateLimit/pointsHistoryRateLimit.js";
import { validateQuery } from "../middleware/validate/validateQuery.js";
import { getMyPointsHistoryUseCase } from "../usecases/pointsHistory/getMyPointsHistory.js";
import { GetPointHistoryQuery, getPointsHistoryQuerySchema } from "../validators/query/pointsHistory.js";

const router = Router();

// GET /points-history?limit=number(&cursor="")
// summary: ポイント履歴取得
// page: /history/points
router.get(
    "/",
    getPointsHistoryRateLimit,
    authenticateToken,
    validateQuery(getPointsHistoryQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const query = req.validatedQuery as GetPointHistoryQuery;

        const { limit, cursor } = query;

        try {
            const { history, hasMore, nextCursor } = await getMyPointsHistoryUseCase({ userId, limit, cursor });

            res.status(200).json({ history, hasMore, nextCursor });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
