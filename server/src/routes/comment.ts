import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Comment, User, CommentLike, CommentReport, Item } from "../models/index.js";
import { AppError } from "../errors.js";
import { patchCommentSortNumberAddUseCase, patchCommentSortNumberDecreaseUseCase } from "../usecases/comment/patchSortNumber.js";
import { deleteCommentUseCase } from "../usecases/comment/delete.js";
import { uploadCommentUseCase } from "../usecases/comment/upload.js";
import { getAllCommentsUseCase } from "../usecases/comment/getAll.js";

const router = Router();

// POST /comment/:id?sellerMe=boolean(&parentId=number)
router.post("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const itemId = Number(req.params.id);

    const commentText: string = req.body.inputComment;
    const commentLength: number = commentText.length;

    const sellerMe = req.query.sellerMe === "true";

    const parentId = Number(req.query?.parentId) ?? null;

    try {
        const comment = await uploadCommentUseCase({
            userId,
            itemId,
            commentText,
            commentLength,
            sellerMe,
            parentId
        });
        
        res.status(200).json({ comment });
    } catch (err) {
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

    res.status(202).json({ message: "sort_numberの更新を受け付けました" });
});

// PATCH /comment/:id/sort-number/decrease?number=number
router.patch("/:id/sort-number/decrease", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const number = Number(req.query.number);
    
    if (!number || isNaN(number)) {
        throw new AppError("INVALID_NUMBER", 400);
    }

    patchCommentSortNumberDecreaseUseCase({ commentId, number }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: "sort_numberの更新を受け付けました" });
});

// DELETE /comment/:id?page=""
router.delete("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    const page = req.query.page as "normal" | "admin";

    if (!page || (page !== "normal" && page !== "admin")) {
        throw new AppError("QUERY_PAGE_INVALID", 400);
    }

    try {
        await deleteCommentUseCase({ userId, commentId, page });
        
        res.status(200).json({ message: "コメントを削除しました。" });
    } catch (err) {
        next(err);
    }
});

// GET /comment/:id?sellerMe=boolean(&admin=boolean)
router.get('/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id ?? null;

    const itemId = Number(req.params.id);

    const sellerMe = req.query.sellerMe === "true";
    const admin = req.query.admin === "true";

    try {
        const commentList = await getAllCommentsUseCase({
            itemId,
            userId,
            sellerMe,
            admin
        });

        res.status(200).json({ commentList });
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