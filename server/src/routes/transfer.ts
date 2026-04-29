import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { AccountTypeOption, BankAccount, Transfer } from "../models/index.js";
import { createTransferPointsUseCase } from "../usecases/transfer/createPoints.js";
import { createTransferRequestUseCase } from "../usecases/transfer/createRequest.js";

const router = Router();

// POST /transfer/request
// summary: 振込申請データ作成
// page: /transfer/request
router.post("/request", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const requestValue = Number(req.body.transValue);
    const limit = Number(req.body.limit);

    try {
        const transId = await createTransferRequestUseCase({ userId, requestValue, limit });

        res.status(200).json({
            message: "振込申請が完了しました。",
            transId,
        });
    } catch (err) {
        next(err);
    }
});

// POST /transfer/points
// summary: 売上金ポイント変換
// page: /transfer/points
router.post("/points", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const value = Number(req.body.value);
    const limit = Number(req.body.limit);

    try {
        await createTransferPointsUseCase({ userId, value, limit });

        res.status(200).json({ message: "売上金をポイント変換しました。" });
    } catch (err) {
        next(err);
    }
});

router.get("/detail/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
});

router.get("/history", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const dataList = await Transfer.findAll({
            attributes: ["id", "trans_money", "trans_finish"],
            where: { user_id: req.user!.id },
            order: [["createdAt", "DESC"]],
        });

        res.json({ dataList });
    } catch (err) {
        next(err);
    }
});

export default router;
