import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../../errors.js";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Item, Video } from "../../models/index.js";
import { deleteAdminItemUseCase } from "../../usecases/admin/items/deleteItem.js";
import { getAdminItemPageUseCase } from "../../usecases/admin/items/getItemPage.js";

const router = Router();

// DELETE /admin/items/:id
// summary: 商品強制削除
// page: /item/admin/[id]
router.delete(
    "/:id",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const adminId = req.user!.id;

        const deleteReason = req.body.deleteReason;

        if (!deleteReason || deleteReason === "") {
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
    authenticateToken,
    isAdmin,
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

router.get(
    "/file-edit-page/:id",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const item = await Item.findByPk(req.params.id, {
                attributes: ["id", "name", "image_url", "sold_out"],
                include: [
                    {
                        model: Video,
                        attributes: ["id", "original_url", "converted_url", "thumbnail_url", "title"],
                    },
                ],
            });

            if (!item) {
                res.status(404).json({ message: "アイテムが見つかりません。" });
                return;
            }

            res.json({ item });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
