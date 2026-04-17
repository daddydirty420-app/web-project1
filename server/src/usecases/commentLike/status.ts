import { getCommentLikeOne } from "../../services/commentLike.js";

type Params = {
    commentId: number;
    userId: number;
};

export const commentLikeStatusUseCase = async ({ commentId, userId }: Params) => {
    const isGood = await getCommentLikeOne({ commentId, userId });

    return !!isGood;
};
