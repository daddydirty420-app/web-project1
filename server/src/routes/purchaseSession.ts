import { Router } from "express";

import { purchaseSessionPostByItemIdController } from "../controllers/purchaseSession.js";
import { authenticateToken } from "../middleware/index.js";
import { createPurchaseSessionRateLimit } from "../middleware/rateLimit/purchaseSession.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /purchase-session/:id
// summary: 購入セッションデータ作成
// page: /item
router.post(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    createPurchaseSessionRateLimit,
    purchaseSessionPostByItemIdController,
);

export default router;
