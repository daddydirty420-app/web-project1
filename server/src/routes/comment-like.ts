import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { authenticateToken } from '../middleware/index.js';
import { CommentLike } from '../models/index.js';
import { getCommentLikeUserListUseCase } from '../usecases/commentLike/userList.js';
import { addCommentLikeUseCase } from '../usecases/commentLike/add.js';
import { deleteCommentLikeUseCase } from '../usecases/commentLike/delete.js';
import { commentLikeStatusUseCase } from '../usecases/commentLike/status.js';
import { countCommentLike } from '../services/commentLike.js';

const router = Router();

// POST /comment-like/:id
router.post('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await addCommentLikeUseCase({ commentId, userId });

        res.status(200).json({ isGood: true });
    } catch (err) {
        next(err);
    }
});

// DELETE /comment-like/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteCommentLikeUseCase({ commentId, userId });

        res.status(200).json({ isGood: false });
    } catch (err) {
        next(err);
    }
});

// GET /comment-like/:id/status
router.get('/:id/status', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        const isGood = await commentLikeStatusUseCase({ commentId, userId });

        res.status(200).json({ isGood });
    } catch (err) {
        next(err);
    }
});

// GET /comment-like/:id/count
router.get('/:id/count', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    try {
        const count = await countCommentLike({ commentId });

        res.status(200).json({ count });
    } catch (err) {
        next(err);
    }
});

// GET /comment-like/:id/user(?keyword="")
router.get('/:id/user', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);

    const userId = req.user!.id;

    const keyword = req.query.keyword as string | undefined;

    try {
        const userList = await getCommentLikeUserListUseCase({ commentId, userId, keyword });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

export default router;
