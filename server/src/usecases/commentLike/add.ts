import { createCommentLike, getCommentLikeOne } from '../../services/commentLike.js';
import { AppError } from '../../errors.js';
import { patchCommentSortNumberAddUseCase } from '../comment/patchSortNumber.js';

type Params = {
    commentId: number;
    userId: number;
};

export const addCommentLikeUseCase = async ({ commentId, userId }: Params) => {
    // CommentLike取得
    const data = await getCommentLikeOne({ commentId, userId });

    if (data) {
        throw new AppError('ALREADY_LIKE_COMMENT', 409, 'すでにいいね済みです');
    }

    // CommentLike作成
    await createCommentLike({ commentId, userId });

    // sort_number非同期
    const number = 100;

    patchCommentSortNumberAddUseCase({ commentId, number }).catch((err) => {
        console.error('usecase patchCommentSortNumberAdd error:', err);
    });
};
