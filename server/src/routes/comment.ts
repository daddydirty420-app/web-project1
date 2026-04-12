import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Comment, User, CommentLike, CommentReport, Item, Notification } from "../models/index.js";
import sequelize from "../db.js";
import { AppError } from "../errors.js";
import { patchCommentSortNumberAddUseCase } from "../usecases/comment/patchSortNumber.js";

const router = Router();

router.post("/upload/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.params.id;
    const commentText: string = req.body.inputComment;
    const commentLength: number = commentText.length;
    const sellerMe = req.query.sellerMe === "true";
    const parentId = req.query?.parentId ?? null;
    const parentIdNum = Number(parentId);

    const t = await sequelize.transaction();

    try {
        if (parentIdNum > 0) {
            const parentComment = await Comment.findByPk(parentIdNum);
            if (!parentComment) {
                res.status(404).json({ message: "parentCommentが見つかりません。" });
                return;
            }

            parentComment.sort_number = parentComment.sort_number + 150;
            await parentComment.save({ transaction: t });
        }

        const commentData = {
            text: commentText,
            sort_number: 500 + commentLength,
            item_id: itemId,
            user_id: currentUserId,
            ...(parentIdNum > 0 ? { parent_comment_id: parentIdNum } : {}),
            ...(sellerMe ? { pin: true } : {}),
        };
        
        const comment = await Comment.create(commentData, { transaction: t });
        if (!comment) {
            res.status(400).json({ message: "コメントデータを作成できません。" });
            return;
        }

        const item = await Item.findByPk(itemId);
        if (!item.sold_out && !currentUserId !== item.seller_id) {
            item.sort_number = Number(item.sort_number) + 25;
            item.sort_buzz_number = Number(item.sort_buzz_number) + 120;
            await item.save({ transaction: t });
        }

        await t.commit();
        res.status(200).json({ comment });
    } catch (err) {
        await t.rollback();
        next(err);
    }
});

// PATCH /comment/:id/sort-number/add?number=number
router.patch("/:id/sort-number/add", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const number = Number(req.query.number);
    
    if (!number || isNaN(number)) {
        throw new AppError("INVALID_NUMBER", 400);
    }

    patchCommentSortNumberAddUseCase({ commentId, number }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: "sort_number加算処理完了。" });
});

router.delete("/delete/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
    const commentId = req.params.id;
    const page = req.query.page;

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

        await Notification.create({
            read_user_id: currentUserId,
            url: `/item/${item.id}`,
            message_image: item.first_image_url,
            message: `${page
                ? `利用規約違反が確認されたため、当該コメントが削除されました。「${comment.text}」`
                : `コメントを削除しました。「${comment.text}」`
            }`,
        }, { transaction: t });

        await comment.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ message: "コメントを削除しました。" });
    } catch (err) {
        await t.rollback();
        next(err);
    }
});

router.get('/all-comment/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user?.id ?? null;
    const itemId = req.params.id;
    const admin = req.query.admin === "true";

    try {
        const commentList = await Comment.findAll({
            where: { 
                item_id: itemId,
                parent_comment_id: null,
            },
            order: [
                ["pin", "DESC"],
                ["sort_number", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image']
                }
            ]
        });

        const commentListWithExtras = await Promise.all(
            commentList.map(async (comment: InstanceType<typeof Comment>) => {
                const commentId = comment.id;

                const replyCount = await Comment.count({
                    where: { parent_comment_id: commentId },
                });

                const goodCount = await CommentLike.count({
                    where: { comment_id: commentId },
                });

                const commentData = comment.toJSON();
                commentData.replyCount = replyCount;
                commentData.goodCount = goodCount;
                commentData.isMyComment = currentUserId !== null && comment.user_id === currentUserId;

                let isGood = false;
                if (currentUserId) {
                    isGood = await CommentLike.findOne({
                        where: {
                            user_id: currentUserId,
                            comment_id: commentId,
                        },
                    });
                }

                commentData.isGoodByMe = !!isGood;

                if (admin) {
                    const reportCount = await CommentReport.count({
                        where: { comment_id: commentId },
                    });

                    commentData.reportCount = reportCount;
                }

                return commentData;
            })
        );

        const item = await Item.findByPk(itemId);
        if (!item.sold_out && currentUserId !== item.seller_id) {
            item.sort_number = Number(item.sort_number) + 8;
            item.sort_buzz_number = Number(item.sort_buzz_number) + 50;
            await item.save();
        }

        res.json({ commentListWithExtras });
    } catch (err) {
        next(err);
    }
});

router.get('/reply-comment/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user?.id ?? null;
    const parentCommentId = req.params.id;
    const admin = req.query.admin === "true";

    try {
        const parentComment = await Comment.findByPk(parentCommentId);
        if (!parentComment) {
            res.status(404).json({ message: "parent_commentが見つかりません。" });
            return;
        }

        const commentList = await Comment.findAll({
            where: { 
                parent_comment_id: parentCommentId
            },
            order: [['sort_number', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image']
                }
            ]
        });

        if (!admin) {
            parentComment.sort_number = Number(parentComment.sort_number) + 10;
            await parentComment.save();
        }

        const commentListWithExtras = await Promise.all(
            commentList.map(async (comment: InstanceType<typeof Comment>) => {
                const commentId = comment.id;

                const goodCount = await CommentLike.count({
                    where: { comment_id: commentId },
                });

                const commentData = comment.toJSON();
                commentData.goodCount = goodCount;
                commentData.isMyComment = currentUserId !== null && comment.user_id === currentUserId;

                let isGood = false;
                if (currentUserId) {
                    isGood = await CommentLike.findOne({
                        where: {
                            user_id: currentUserId,
                            comment_id: commentId,
                        }
                    });
                }

                commentData.isGoodByMe = !!isGood;

                if (admin) {
                    const reportCount = await CommentReport.count({
                        where: { comment_id: commentId },
                    });

                    commentData.reportCount = reportCount;
                }

                return commentData;
            })
        );

        res.json({ commentListWithExtras });
    } catch (err) {
        next(err);
    }
});

export default router;