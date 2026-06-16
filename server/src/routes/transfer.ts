import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import {
    transferDetailRateLimit,
    transferHistoryRateLimit,
    transferPointsRateLimit,
    transferRequestRateLimit,
} from "../middleware/rateLimit/transferRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { validateQuery } from "../middleware/validate/validateQuery.js";
import { createTransferPointsUseCase } from "../usecases/transfer/createPoints.js";
import { createTransferRequestUseCase } from "../usecases/transfer/createRequest.js";
import { getTransferDetailUseCase } from "../usecases/transfer/getDetail.js";
import { getTransferHistoryUseCase } from "../usecases/transfer/getTransferHistory.js";
import { TransferBody, transferBodySchema } from "../validators/body/transfer.js";
import { idParamSchema } from "../validators/params/id.js";
import { GetTransferHistoryQuery, getTransferHistoryQuerySchema } from "../validators/query/transfer.js";

const router = Router();

// POST /transfer/request
// summary: 振込申請データ作成
// page: /transfer/request
router.post(
    "/request",
    authenticateToken,
    transferRequestRateLimit,
    validateBody(transferBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const body = req.validatedBody as TransferBody;
        const { value, limit } = body;

        try {
            const transId = await createTransferRequestUseCase({ userId, requestValue: value, limit });

            res.status(200).json({
                message: "振込申請が完了しました。",
                transId,
            });
        } catch (err) {
            next(err);
        }
    },
);

// POST /transfer/points
// summary: 売上金ポイント変換
// page: /transfer/points
router.post(
    "/points",
    authenticateToken,
    transferPointsRateLimit,
    validateBody(transferBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const body = req.validatedBody as TransferBody;
        const { value, limit } = body;

        try {
            await createTransferPointsUseCase({ userId, value, limit });

            res.status(200).json({ message: "売上金をポイント変換しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /transfer/history?limit=number(&cursor="")
// summary: 振込申請履歴取得
// page: /transfer/history
router.get(
    "/history",
    transferHistoryRateLimit,
    authenticateToken,
    validateQuery(getTransferHistoryQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const query = req.validatedQuery as GetTransferHistoryQuery;
        const { limit, cursor } = query;

        try {
            const { history, hasMore, nextCursor } = await getTransferHistoryUseCase({ userId, limit, cursor });

            res.status(200).json({ history, hasMore, nextCursor });
        } catch (err) {
            next(err);
        }
    },
);

// GET /transfer/:id/detail
// summary: 振込申請詳細表示
// page: /transfer/detail/[id]
router.get(
    "/:id/detail",
    transferDetailRateLimit,
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const transId = Number(req.params.id);

        try {
            const transfer = await getTransferDetailUseCase({ transId });

            res.status(200).json({ transfer });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
