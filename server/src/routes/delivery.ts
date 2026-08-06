import { Router } from "express";
import {
    deliveryPostByIdController,
    deliveryGetByIdAddressController,
    deliveryGetByIdNameController,
} from "../controllers/delivery.js";
import { authenticateToken } from "../middleware/index.js";
import {
    createDeliveryRateLimit,
    getAddressRateLimit,
    getNameRateLimit,
} from "../middleware/rateLimit/deliveryRateLimit.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /delivery/:id
// summary: 配送データ作成
// page: /item
router.post(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    createDeliveryRateLimit,
    deliveryPostByIdController,
);

// GET /delivery/:id/address
// summary: 配送用住所取得
// page: /edit/address/delivery/[id]
router.get(
    "/:id/address",
    getAddressRateLimit,
    validateParams(idParamSchema),
    authenticateToken,
    deliveryGetByIdAddressController,
);

// GET /delivery/:id/name
// summary: 配送用氏名取得
// page: /edit/name/delivery/[id]
router.get(
    "/:id/name",
    getNameRateLimit,
    validateParams(idParamSchema),
    authenticateToken,
    deliveryGetByIdNameController,
);

export default router;
