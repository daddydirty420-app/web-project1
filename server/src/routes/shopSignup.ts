import { Router } from "express";
import {
    shopSignupPostRootController,
    updateShopSignup2Controller,
    updateShopSignup3Controller,
} from "../controllers/shopSignup.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createShopSignupRateLimit, signup2RateLimit, signup3RateLimit } from "../middleware/rateLimit/shopSignup.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { bankBodySchema } from "../validators/body/bankAccount.js";
import { createSignup1BodySchema, shopSignup3BodySchema } from "../validators/body/shopSignup.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /shop-signup
// summary: ShopSignup作成 事業者登録
// page: /shop-signup/step1
router.post(
    "/",
    authenticateToken,
    createShopSignupRateLimit,
    validateBody(createSignup1BodySchema),
    shopSignupPostRootController,
);

// PATCH /shop-signup/:id/bank-account
// summary: ショップ口座情報作成
// page: /shop-signup/step2
router.patch(
    "/:id/bank-account",
    validateParams(idParamSchema),
    validateBody(bankBodySchema),
    authenticateToken,
    signup2RateLimit,
    updateShopSignup2Controller,
);

// PATCH /shop-signup/:id/id-card
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step3/[id]
router.patch(
    "/:id/id-card",
    validateParams(idParamSchema),
    validateBody(shopSignup3BodySchema),
    authenticateToken,
    signup3RateLimit,
    updateShopSignup3Controller,
);

export default router;
