import { getComment, updateSortNumber } from '../../services/comment.js';
import { AppError } from '../../errors.js';

type Params = {
    commentId: number;
    number: number;
};

export const patchCommentSortNumberAddUseCase = async ({ commentId, number }: Params) => {
    const comment = await getComment({ commentId });

    if (!comment) {
        throw new AppError('COMMENT_NOT_FOUND', 404);
    }

    const newSortNumber = comment.sort_number + number;

    updateSortNumber({ comment, data: { sort_number: newSortNumber } }).catch((err) => {
        console.error('service Comment updateSortNumber error:', err);
    });
};

export const patchCommentSortNumberDecreaseUseCase = async ({ commentId, number }: Params) => {
    const comment = await getComment({ commentId });

    if (!comment) {
        throw new AppError('COMMENT_NOT_FOUND', 404);
    }

    const newSortNumber = comment.sort_number - Math.min(comment.sort_number, number);

    updateSortNumber({ comment, data: { sort_number: newSortNumber } }).catch((err) => {
        console.error('service Comment updateSortNumber error:', err);
    });
};
