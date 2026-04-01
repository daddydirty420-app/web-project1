import { AppError } from "../../errors.js";
import { Comment } from "../../models/index.js";

type Params = {
    commentId: number;
    number: number;
};

export const patchCommentSortNumberAdd = async ({ commentId, number }: Params) => {

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
        throw new AppError("COMMENT_NOT_FOUND", 404);
    }

    await comment.update({
        sort_number: comment.sort_number + number,
    });
};

export const patchCommentSortNumberDecrease = async ({ commentId, number }: Params) => {

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
        throw new AppError("COMMENT_NOT_FOUND", 404);
    }

    await comment.update({
        sort_number: comment.sort_number - Math.min(comment.sort_number, number),
    });
};