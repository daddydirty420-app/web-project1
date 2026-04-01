import { AppError } from "../../errors.js";
import { CommentLike } from "../../models/index.js";
import { patchCommentSortNumberDecrease } from "../comment/patchSortNumber.service.js";

type Params = {
    commentId: number;
    userId: number;
};

export const deleteCommentLike = async ({ commentId, userId }: Params) => {

    // CommentLike取得
    const data = await CommentLike.findOne({
        where: {
            comment_id: commentId,
            user_id: userId,
        },
    });

    if (!data) {
        throw new AppError("NOT_LIKE_COMMENT", 409, "いいねしていません");
    }

    // CommentLike削除
    await data.destroy();

    // sort_number非同期
    const number = 100;

    patchCommentSortNumberDecrease({ commentId, number }).catch((err) => {
        console.error("patchCommentSortNumberAdd error:", err);
    });
};