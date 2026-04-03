import { Comment } from "../../../../models/index.js";

type Params = {
    itemId: number;
};

export const getCommentCount = async ({ itemId }: Params) => {

    const commentCount = await Comment.count({
        where: { item_id: itemId },
    });

    return commentCount;
};