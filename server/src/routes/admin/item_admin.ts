import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../../errors.js";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { adminDeleteItemRateLimit, adminItemPageRateLimit } from "../../middleware/rateLimit/admin/itemRateLimit.js";
import { validateBody } from "../../middleware/validate/validateBody.js";
import { validateParams } from "../../middleware/validate/validateParams.js";
import { deleteAdminItemUseCase } from "../../usecases/admin/items/deleteItem.js";
import { getAdminItemPageUseCase } from "../../usecases/admin/items/getItemPage.js";
import { DeleteReasonBody, deleteReasonBodySchema } from "../../validators/body/admin/admin.js";
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
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const adminId = req.user!.id;

        const body = req.validatedBody as DeleteReasonBody;

        const deleteReason = body.deleteReason;

        if (!deleteReason.trim()) {
            throw new AppError("INVALID_BODY_EMPTY", 400);
        }

        try {
            await deleteAdminItemUseCase({ itemId, adminId, deleteReason });

            res.status(200).json({ message: "商品を削除しました。" });
        } catch (err) {
            next(err);
        }
    },
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
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const { item, likeCount, commentCount, reportCount, me } = await getAdminItemPageUseCase({
                itemId,
                userId,
            });

            res.status(200).json({
                item,
                likeCount,
                commentCount,
                reportCount,
                me,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
