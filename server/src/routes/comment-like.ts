import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { CommentLike, User, Follow, ShopInfo, Comment } from "../models/index.js";
import { getCommentLikeUserList } from "../services/commentLike/userList.service.js";

const router = Router();

router.post("/add/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
    const commentId = req.params.id;

    try {
        const data = await CommentLike.findOne({
            where: {
                user_id: currentUserId,
                comment_id: commentId,
            },
        });
        if (data) {
            res.status(409).json({ message: "すでにいいね済みです。" });
            return;
        }

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            res.status(404).json({ message: "コメントが見つかりません。" });
            return;
        }

        await CommentLike.create({
            user_id: currentUserId,
            comment_id: commentId,
        });

        comment.sort_number = Number(comment.sort_number) + 100;
        await comment.save();

        res.status(200).json({ isGood: true });
    } catch (err) {
        next(err);
    }
});

router.delete("/remove/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
    const commentId = req.params.id;

    try {
        const data = await CommentLike.findOne({
            where: {
                user_id: currentUserId,
                comment_id: commentId,
            },
        });
        if (!data) {
            res.status(409).json({ message: "いいねしていません。" });
            return;
        }

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            res.status(404).json({ message: "コメントが見つかりません。" });
            return;
        }

        await data.destroy();

        if (comment.sort_number > 0) {
            const sortNumber = Number(comment.sort_number);
            const newSort = sortNumber - Math.min(100, sortNumber);
            comment.sort_number = newSort;
            await comment.save();
        }

        res.status(200).json({ isGood: false });
    } catch (err) {
        next(err);
    }
});

router.get("/status/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isGood = await CommentLike.findOne({
            where: {
                user_id: req.user!.id,
                comment_id: req.params.id,
            },
        });


        res.status(200).json({ isGood: !!isGood });
    } catch (err) {
        next(err);
    }
});

router.get("/count/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const count = await CommentLike.count({
            where: { comment_id: req.params.id },
        });

        res.status(200).json({ count });
    } catch (err) {
        next(err);
    }
});

// GET /comment-like/:id/user(?keyword="")
router.get("/:id/user", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    const keyword = req.query.keyword as string | undefined;

    try {
        const userList = await getCommentLikeUserList({ commentId, userId, keyword });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

export default router;