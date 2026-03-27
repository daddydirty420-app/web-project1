import { ItemLike } from "../../models/index.js";

type Params = {
    itemId: number;
    userId: number;
};

export const itemLikeStatus = async ({ itemId, userId }: Params) => {

    const isGood = await ItemLike.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });

    return !!isGood;
};