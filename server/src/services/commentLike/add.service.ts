import { AppError } from "../../errors.js";
import { CommentLike } from "../../models/index.js";
import { patchCommentSortNumberAdd } from "../comment/patchSortNumber.service.js";

type Params = {
    commentId: number;
    userId: number;
};

export const addCommentLike = async ({ commentId, userId }: Params) => {

    // CommentLike取得
    const data = await CommentLike.findOne({
        where: {
            comment_id: commentId,
            user_id: userId,
        },
    });

    if (data) {
        throw new AppError("ALREADY_LIKE_COMMENT", 409, "すでにいいね済みです");
    }

    // CommentLike作成
    await CommentLike.create({
        comment_id: commentId,
        user_id: userId,
    });

    // sort_number非同期
    const number = 100;

    patchCommentSortNumberAdd({ commentId, number }).catch((err) => {
        console.error("patchCommentSortNumberAdd error:", err);
    });
};