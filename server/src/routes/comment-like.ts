import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { CommentLike } from "../models/index.js";
import { getCommentLikeUserList } from "../services/commentLike/userList.service.js";
import { addCommentLike } from "../services/commentLike/add.service.js";
import { deleteCommentLike } from "../services/commentLike/delete.service.js";

const router = Router();

// POST /comment-like/:id
router.post("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await addCommentLike({ commentId, userId });

        res.status(200).json({ isGood: true });
    } catch (err) {
        next(err);
    }
});

// DELETE /comment-like/:id
router.delete("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteCommentLike({ commentId, userId });

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