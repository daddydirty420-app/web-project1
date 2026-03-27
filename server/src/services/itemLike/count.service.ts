import { ItemLike } from "../../models/index.js";

type Params = {
    itemId: number;
};

export const itemLikeCount = async ({ itemId }: Params) => {

    const count = await ItemLike.count({
        where: { item_id: itemId },
    });

    return count;
};