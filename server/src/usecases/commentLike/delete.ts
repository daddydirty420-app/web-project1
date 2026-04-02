import { destroyCommentLike, findCommentLike } from "../../services/commentLike.js";
import { AppError } from "../../errors.js";
import { patchCommentSortNumberDecrease } from "../../services/comment/patchSortNumber.service.js";

type Params = {
    commentId: number;
    userId: number;
};

export const deleteCommentLikeUseCase = async ({ commentId, userId }: Params) => {

    // CommentLike取得
    const data = await findCommentLike({ commentId, userId });

    if (!data) {
        throw new AppError("NOT_LIKE_COMMENT", 409, "いいねしていません");
    }

    // CommentLike削除
    await destroyCommentLike({ data });

    // sort_number非同期
    const number = 100;

    patchCommentSortNumberDecrease({ commentId, number }).catch((err) => {
        console.error("patchCommentSortNumberAdd error:", err);
    });
};