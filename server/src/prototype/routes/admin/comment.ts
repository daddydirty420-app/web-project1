import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import sequelize from "../../../db.js";
import { authenticateToken, isAdmin } from "../../../middleware/index.js";
import { validateParams } from "../../../middleware/validate/validateParams.js";
import { Comment, Item, Notification } from "../../../models/index.js";
import { idParamSchema } from "../../../validators/params/id.js";

const router = Router();

router.post(
    "/delete/:id",
    validateParams(idParamSchema),
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = req.params.id;

        const t = await sequelize.transaction();

        try {
            const comment = await Comment.findByPk(commentId);

            if (!comment) {
                res.status(404).json({ message: "コメントが見つかりません。" });
                return;
            }

            const item = await Item.findByPk(comment.item_id);

            if (!item) {
                res.status(404).json({ message: "商品が見つかりません。" });
                return;
            }

            await Notification.create(
                {
                    read_user_id: comment.user_id,
                    url: `/item/${item.id}`,
                    message_image: item.first_image_url,
                    message: `利用規約違反が確認されたため、コメントが削除されました。「${comment.text}」`,
                },
                { transaction: t },
            );

            await comment.destroy({ transaction: t });

            await t.commit();

            res.status(200).json({ message: "コメントを削除しました。" });
        } catch (err) {
            await t.rollback();
            next(err);
        }
    },
);

export default router;
