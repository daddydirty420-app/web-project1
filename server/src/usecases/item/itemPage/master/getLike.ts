import { ItemLike } from "../../../../models/index.js";

type Params = {
    itemId: number;
    userId: number | null;
};

export const getLike = async ({ itemId, userId }: Params) => {

    const likeCount = await ItemLike.count({
        where: { item_id: itemId },
    });

    const isLike = await ItemLike.findOne({
        where: {
            user_id: userId,
            item_id: itemId,
        },
    });

    const isLikeByMe = !!isLike;

    return {
        likeCount,
        isLikeByMe
    };
};