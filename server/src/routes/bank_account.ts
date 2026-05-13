import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { bankEditRateLimit, getAccountRateLimit } from "../middleware/rateLimit/bankAccountRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { createShopAccount } from "../usecases/bankAccount/createShop.js";
import { editAccountUseCase } from "../usecases/bankAccount/editAccount.js";
import { getMyAccountUseCase } from "../usecases/bankAccount/getMyAccount.js";
import { BankBody, bankBodySchema } from "../validators/body/bankAccount.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /bank-account/:id/shop
// summary: ショップ口座情報作成
// page: /shop-signup/step2
router.post(
    "/:id/shop",
    validateParams(idParamSchema),
    validateBody(bankBodySchema),
    authenticateToken,
    bankEditRateLimit,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as BankBody;

        try {
            await createShopAccount({ shopId, userId, body });

            res.status(200).json({ message: "口座情報を登録しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /bank-account/:id
// summary: 口座情報変更
// page: /edit/account
router.patch(
    "/:id",
    validateParams(idParamSchema),
    validateBody(bankBodySchema),
    authenticateToken,
    bankEditRateLimit,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const accountId = Number(req.params.id);

        const body = req.validatedBody as BankBody;

        try {
            await editAccountUseCase({
                accountId,
                body,
            });

            res.status(200).json({ message: "口座情報を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /bank-account/myaccount
// summary: 口座情報取得
// page: /edit/account
router.get(
    "/myaccount",
    getAccountRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const data = await getMyAccountUseCase({ userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
