import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { transferPointsRateLimit, transferRequestRateLimit } from "../middleware/rateLimit/transferRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { AccountTypeOption, BankAccount, Transfer } from "../models/index.js";
import { createTransferPointsUseCase } from "../usecases/transfer/createPoints.js";
import { createTransferRequestUseCase } from "../usecases/transfer/createRequest.js";
import { TransferBody, transferBodySchema } from "../validators/body/transfer.js";
import { idParamSchema } from "../validators/params/id.js";

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

router.get(
    "/detail/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await Transfer.findByPk(req.params.id, {
                attributes: ["id", "trans_money", "transfer_id", "createdAt"],
                include: [
                    {
                        model: BankAccount,
                        attributes: ["id", "bank_name", "branch_code", "account_number", "meigi"],
                        include: [{ model: AccountTypeOption }],
                    },
                ],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json({ data });
        } catch (err) {
            next(err);
        }
    },
);

// GET /transfer/history?limit=number(&cursor=number)
// summary: 振込申請履歴取得
// page: /transfer/history
router.get("/history", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const dataList = await Transfer.findAll({
            attributes: ["id", "trans_money", "trans_finish"],
            where: { user_id: req.user!.id },
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({ dataList });
    } catch (err) {
        next(err);
    }
});

export default router;
