import { Router } from "express";
import {
    adminUserAdminDeleteByIdController,
    adminUserAdminPatchByIdAddPenaltyController,
    adminUserAdminPatchByIdDeleteUriageController,
    adminUserAdminGetByIdProfileController,
} from "../../controllers/admin/user_admin.js";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import {
    adminAddPenaltyRateLimit,
    adminDeleteUriageRateLimit,
    adminDeleteUserRateLimit,
    adminProfileRateLimit,
} from "../../middleware/rateLimit/admin/userRateLimit.js";
import { validateBody } from "../../middleware/validate/validateBody.js";
import { validateParams } from "../../middleware/validate/validateParams.js";
import { deleteReasonBodySchema } from "../../validators/body/admin/admin.js";
import { addPenaltyBodySchema, deleteUriageBodySchema } from "../../validators/body/admin/users.js";
import { idParamSchema } from "../../validators/params/id.js";

const router = Router();

// DELETE /admin/user/:id
// summary: ユーザー強制削除
// page: /profile/admin/[id]
router.delete(
    "/:id",
    validateParams(idParamSchema),
    validateBody(deleteReasonBodySchema),
    authenticateToken,
    isAdmin,
    adminDeleteUserRateLimit,
    adminUserAdminDeleteByIdController,
);

// PATCH /admin/user/:id/add-penalty
// summary: ペナルティポイント追加
// page: /profile/admin/[id]
router.patch(
    "/:id/add-penalty",
    validateParams(idParamSchema),
    validateBody(addPenaltyBodySchema),
    authenticateToken,
    isAdmin,
    adminAddPenaltyRateLimit,
    adminUserAdminPatchByIdAddPenaltyController,
);

// PATCH /admin/user/:id/delete-uriage
// summary: 売上金没収
// page: /profile/admin/[id]
router.patch(
    "/:id/delete-uriage",
    validateParams(idParamSchema),
    validateBody(deleteUriageBodySchema),
    authenticateToken,
    isAdmin,
    adminDeleteUriageRateLimit,
    adminUserAdminPatchByIdDeleteUriageController,
);

// GET /admin/user/:id/profile
// summary: 管理者用プロフィールページ データ取得
// page: /profile/admin/[id]
router.get(
    "/:id/profile",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    adminProfileRateLimit,
    adminUserAdminGetByIdProfileController,
);

export default router;
