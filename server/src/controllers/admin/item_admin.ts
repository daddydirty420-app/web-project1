import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../../errors.js";
import { deleteAdminItemUseCase } from "../../usecases/admin/items/deleteItem.js";
import { getAdminItemPageUseCase } from "../../usecases/admin/items/getItemPage.js";
import { DeleteReasonBody } from "../../validators/body/admin/admin.js";

// DELETE /admin/items/:id
// summary: 商品強制削除
// page: /item/admin/[id]
export const adminItemAdminDeleteByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
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
};

// GET /admin/items/:id/item-page
// summary: 管理者用商品ページデータ取得
// page: /item/admin/[id]
export const adminItemAdminGetByIdItemPageController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
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
};
