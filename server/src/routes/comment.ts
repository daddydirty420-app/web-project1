import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { deleteCommentUseCase } from "../usecases/comment/delete.js";
import { getAllCommentsUseCase } from "../usecases/comment/getAll.js";
import { getAllRepliesUseCase } from "../usecases/comment/getReply.js";
import {
    patchCommentSortNumberAddUseCase,
    patchCommentSortNumberDecreaseUseCase,
} from "../usecases/comment/patchSortNumber.js";
import { uploadCommentUseCase } from "../usecases/comment/upload.js";

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
            parentId,
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
router.get("/:id", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id ?? null;

    const itemId = Number(req.params.id);

    const sellerMe = req.query.sellerMe === "true";
    const admin = req.query.admin === "true";

    try {
        const commentList = await getAllCommentsUseCase({
            itemId,
            userId,
            sellerMe,
            admin,
        });

        res.status(200).json({ commentList });
    } catch (err) {
        next(err);
    }
});

// GET /comment/:id/reply?sellerMe=boolean(&admin=boolean)
router.get(
    "/:id/reply",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id ?? null;

        const parentCommentId = Number(req.params.id);

        const sellerMe = req.query.sellerMe === "true";
        const admin = req.query.admin === "true";

        try {
            const commentList = await getAllRepliesUseCase({
                parentCommentId,
                userId,
                sellerMe,
                admin,
            });

            res.status(200).json({ commentList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
