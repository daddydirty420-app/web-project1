import type { NextFunction, Request, Response } from "express-serve-static-core";
import { deleteCommentUseCase } from "../usecases/comment/delete.js";
import { getAllCommentsUseCase } from "../usecases/comment/getAll.js";
import { getAllRepliesUseCase } from "../usecases/comment/getReply.js";
import {
    patchCommentSortNumberAddUseCase,
    patchCommentSortNumberDecreaseUseCase,
} from "../usecases/comment/patchSortNumber.js";
import { uploadCommentUseCase } from "../usecases/comment/upload.js";
import { CreateCommentBody } from "../validators/body/comment.js";
import {
    CommentPageQuery,
    CommentSellerMeAdminQuery,
    CommentSortNumberQuery,
    CreateCommentQuery,
} from "../validators/query/comment.js";

// POST /comment/:id?sellerMe=boolean(&parentId=number)
// summary: コメント作成
// page: /item
export const commentPostByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const itemId = Number(req.params.id);

    const query = req.validatedQuery as CreateCommentQuery;
    const { sellerMe, parentId } = query;

    const body = req.validatedBody as CreateCommentBody;
    const commentText = body.inputComment;
    const commentLength = commentText.length;

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
};

// PATCH /comment/:id/sort-number/add?number=number
// summary: sort_number追加
// page: /item
export const commentPatchByIdSortNumberAddController = async (req: Request, res: Response): Promise<void> => {
    const commentId = Number(req.params.id);

    const query = req.validatedQuery as CommentSortNumberQuery;
    const number = query.number;

    patchCommentSortNumberAddUseCase({ commentId, number }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: "sort_numberの更新を受け付けました" });
};

// PATCH /comment/:id/sort-number/decrease?number=number
// summary: sort_number減少
// page: /item
export const commentPatchByIdSortNumberDecreaseController = async (req: Request, res: Response): Promise<void> => {
    const commentId = Number(req.params.id);

    const query = req.validatedQuery as CommentSortNumberQuery;
    const number = query.number;

    patchCommentSortNumberDecreaseUseCase({ commentId, number }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: "sort_numberの更新を受け付けました" });
};

// DELETE /comment/:id?page=""
// summary: コメント削除
// page: /item・/item/admin
export const commentDeleteByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);
    const userId = req.user!.id;

    const query = req.validatedQuery as CommentPageQuery;
    const page = query.page;

    try {
        await deleteCommentUseCase({ userId, commentId, page });

        res.status(200).json({ message: "コメントを削除しました。" });
    } catch (err) {
        next(err);
    }
};

// GET /comment/:id?sellerMe=boolean(&admin=boolean)
// summary: コメント一覧取得
// page: /item
export const commentGetByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id ?? null;
    const itemId = Number(req.params.id);

    const query = req.validatedQuery as CommentSellerMeAdminQuery;
    const { sellerMe, admin } = query;

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
};

// GET /comment/:id/reply?sellerMe=boolean(&admin=boolean)
// summary: 返信リスト取得
// page: /item
export const commentGetByIdReplyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id ?? null;
    const parentCommentId = Number(req.params.id);

    const query = req.validatedQuery as CommentSellerMeAdminQuery;
    const { sellerMe, admin } = query;

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
};
