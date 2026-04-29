import { countCommentLike } from "../../services/commentLike.js";

type Params = {
    commentId: number;
};

// GET /comment-like/:id/count
// summary: いいね数取得
// page: /item
export const countCommentLikeUseCase = async ({ commentId }: Params) => {
    const count = await countCommentLike({ commentId });

    return count;
};
