import { createCommentLike, findCommentLike } from "../../services/commentLike.js";
import { AppError } from "../../errors.js";
import { patchCommentSortNumberAdd } from "../../services/comment/patchSortNumber.service.js";

type Params = {
    commentId: number;
    userId: number;
};

export const addCommentLikeUseCase = async ({ commentId, userId }: Params) => {

    // CommentLike取得
    const data = await findCommentLike({ commentId, userId });

    if (data) {
        throw new AppError("ALREADY_LIKE_COMMENT", 409, "すでにいいね済みです");
    }

    // CommentLike作成
    await createCommentLike({ commentId, userId });

    // sort_number非同期
    const number = 100;

    patchCommentSortNumberAdd({ commentId, number }).catch((err) => {
        console.error("patchCommentSortNumberAdd error:", err);
    });
};