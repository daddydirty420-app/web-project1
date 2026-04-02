import { findItemLike } from "services/itemLike.js";

type Params = {
    itemId: number;
    userId: number;
};

export const itemLikeStatusUseCase = async ({ itemId, userId }: Params) => {
    const isGood = await findItemLike({ itemId, userId });

    return !!isGood;
};