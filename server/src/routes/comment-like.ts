import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { validateParams } from "../middleware/validateParams.js";
import { countCommentLike } from "../services/commentLike.js";
import { addCommentLikeUseCase } from "../usecases/commentLike/add.js";
import { deleteCommentLikeUseCase } from "../usecases/commentLike/delete.js";
import { commentLikeStatusUseCase } from "../usecases/commentLike/status.js";
import { getCommentLikeUserListUseCase } from "../usecases/commentLike/userList.js";
import { idParamSchema } from "../validators/params/id.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { KeywordOptionalQuery, keywordOptionalQuerySchema } from "../validators/query/keyword.js";

const router = Router();

// POST /comment-like/:id
// summary: いいね作成
// page: /item
router.post(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await addCommentLikeUseCase({ commentId, userId });

            res.status(200).json({ isGood: true });
        } catch (err) {
            next(err);
        }
    },
);

// DELETE /comment-like/:id
// summary: いいね削除
// page: /item
router.delete(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await deleteCommentLikeUseCase({ commentId, userId });

            res.status(200).json({ isGood: false });
        } catch (err) {
            next(err);
        }
    },
);

// GET /comment-like/:id/status
// summary: いいねステータス取得
// page: /item
router.get(
    "/:id/status",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            const isGood = await commentLikeStatusUseCase({ commentId, userId });

            res.status(200).json({ isGood });
        } catch (err) {
            next(err);
        }
    },
);

// GET /comment-like/:id/count
// summary: いいね数取得
// page: /item
router.get(
    "/:id/count",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = Number(req.params.id);

        try {
            const count = await countCommentLike({ commentId });

            res.status(200).json({ count });
        } catch (err) {
            next(err);
        }
    },
);

// GET /comment-like/:id/user(?keyword="")
// summary: いいねしたユーザーリスト取得
// page: /user-list/comment-like/[id]
router.get(
    "/:id/user",
    validateParams(idParamSchema),
    validateQuery(keywordOptionalQuerySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = Number(req.params.id);
        const userId = req.user!.id;

        const query = req.validatedQuery as KeywordOptionalQuery;
        const keyword = query.keyword;

        try {
            const userList = await getCommentLikeUserListUseCase({ commentId, userId, keyword });

            res.status(200).json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
