import { destroyCommentLike, getCommentLikeOne } from "../../services/commentLike.js";
import { AppError } from "../../errors.js";
import { patchCommentSortNumberDecreaseUseCase } from "../comment/patchSortNumber.js";

type Params = {
    commentId: number;
    userId: number;
};

export const deleteCommentLikeUseCase = async ({ commentId, userId }: Params) => {
    // CommentLike取得
    const data = await getCommentLikeOne({ commentId, userId });

    if (!data) {
        throw new AppError("NOT_LIKE_COMMENT", 409, "いいねしていません");
    }

    // CommentLike削除
    await destroyCommentLike({ data });

    // sort_number非同期
    const number = 100;

    patchCommentSortNumberDecreaseUseCase({ commentId, number }).catch((err) => {
        console.error("usecase patchCommentSortNumberAdd error:", err);
    });
};
