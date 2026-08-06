import { Router } from "express";
import {
    adminItemAdminDeleteByIdController,
    adminItemAdminGetByIdItemPageController,
} from "../../controllers/admin/item_admin.js";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { adminDeleteItemRateLimit, adminItemPageRateLimit } from "../../middleware/rateLimit/admin/itemRateLimit.js";
import { validateBody } from "../../middleware/validate/validateBody.js";
import { validateParams } from "../../middleware/validate/validateParams.js";
import { deleteReasonBodySchema } from "../../validators/body/admin/admin.js";
import { idParamSchema } from "../../validators/params/id.js";

const router = Router();

// DELETE /admin/items/:id
// summary: 商品強制削除
// page: /item/admin/[id]
router.delete(
    "/:id",
    validateParams(idParamSchema),
    validateBody(deleteReasonBodySchema),
    authenticateToken,
    isAdmin,
    adminDeleteItemRateLimit,
    adminItemAdminDeleteByIdController,
);

// GET /admin/items/:id/item-page
// summary: 管理者用商品ページデータ取得
// page: /item/admin/[id]
router.get(
    "/:id/item-page",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    adminItemPageRateLimit,
    adminItemAdminGetByIdItemPageController,
);

export default router;
