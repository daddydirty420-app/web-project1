import { countCommentLike } from "../../services/commentLike.js";

type Params = {
    commentId: number;
};

export const countCommentLikeUseCase = async ({ commentId }: Params) => {
    const count = await countCommentLike({ commentId });

    return count;
};