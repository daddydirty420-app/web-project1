import { Router } from "express";
import {
    bankAccountPostByIdShopController,
    bankAccountPatchByIdController,
} from "../controllers/bank_account.js";
import { authenticateToken } from "../middleware/index.js";
import { bankEditRateLimit } from "../middleware/rateLimit/bankAccountRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { bankBodySchema } from "../validators/body/bankAccount.js";
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
    bankAccountPostByIdShopController,
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
    bankAccountPatchByIdController,
);

export default router;
