import { AppError } from "../../errors.js";
import { getComment, updateSortNumber } from "../../services/comment.js";

type Params = {
    commentId: number;
    number: number;
};

// PATCH /comment/:id/sort-number/add?number=number
// summary: sort_number追加
// page: /item
export const patchCommentSortNumberAddUseCase = async ({ commentId, number }: Params) => {
    const comment = await getComment({ commentId });

    if (!comment) {
        throw new AppError("COMMENT_NOT_FOUND", 404);
    }

    const newSortNumber = comment.sort_number + number;

    updateSortNumber({ comment, data: { sort_number: newSortNumber } }).catch((err) => {
        console.error("service Comment updateSortNumber error:", err);
    });
};

// PATCH /comment/:id/sort-number/decrease?number=number
// summary: sort_number減少
// page: /item
export const patchCommentSortNumberDecreaseUseCase = async ({ commentId, number }: Params) => {
    const comment = await getComment({ commentId });

    if (!comment) {
        throw new AppError("COMMENT_NOT_FOUND", 404);
    }

    const newSortNumber = comment.sort_number - Math.min(comment.sort_number, number);

    updateSortNumber({ comment, data: { sort_number: newSortNumber } }).catch((err) => {
        console.error("service Comment updateSortNumber error:", err);
    });
};
