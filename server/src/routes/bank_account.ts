import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { createShopAccount } from "../usecases/bankAccount/createShop.js";
import { editAccountUseCase } from "../usecases/bankAccount/editAccount.js";
import { getMyAccountUseCase } from "../usecases/bankAccount/getMyAccount.js";

const router = Router();

// POST /bank-account/:id/shop
// summary: ショップ口座情報作成
// page: /shop-signup/step2
router.post("/:id/shop", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = Number(req.params.id);
    const userId = req.user!.id;
    const body = req.body;

    try {
        await createShopAccount({ shopId, userId, body });

        res.status(200).json({ message: "口座情報を登録しました。" });
    } catch (err) {
        next(err);
    }
});

// PATCH /bank-account/:id
router.patch("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accountId = Number(req.params.id);

    const { bankName, branch, accountType, accountNumber, meigi } = req.body;

    // 空チェック
    const fields = { bankName, branch, accountType, accountNumber, meigi };
    const hasEmpty = Object.values(fields).some((v) => !v?.trim());
    if (hasEmpty) throw new AppError("INVALID_QUERY", 400);

    const bankNameTrim = bankName.trim();
    const branchTrim = branch.trim();
    const accountNumberTrim = accountNumber.trim();

    try {
        await editAccountUseCase({
            accountId,
            bankName: bankNameTrim,
            branch: branchTrim,
            accountType,
            accountNumber: accountNumberTrim,
            meigi,
        });

        res.status(200).json({ message: "口座情報を更新しました。" });
    } catch (err) {
        next(err);
    }
});

// GET /bank-account/myaccount
router.get("/myaccount", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const data = await getMyAccountUseCase({ userId });

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

export default router;
