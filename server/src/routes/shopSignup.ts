import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { createSignup1BodySchema } from "../validators/body/shopSignup.js";
import { shopSignupPostRootController } from "../controllers/shopSignup.js";
import { createShopSignupRateLimit } from "../middleware/rateLimit/shopSignup.js";

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

export default router;