import { Router } from "express";
import { shopSignupPostRootController, updateShopSignup2Controller } from "../controllers/shopSignup.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createShopSignupRateLimit, signup2RateLimit } from "../middleware/rateLimit/shopSignup.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { bankBodySchema } from "../validators/body/bankAccount.js";
import { createSignup1BodySchema } from "../validators/body/shopSignup.js";
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

export default router;
