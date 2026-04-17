import { getItemLikeOne } from "../../services/itemLike.js";

type Params = {
    itemId: number;
    userId: number;
};

export const itemLikeStatusUseCase = async ({ itemId, userId }: Params) => {
    const isGood = await getItemLikeOne({ itemId, userId });

    return !!isGood;
};
