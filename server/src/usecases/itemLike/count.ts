import { countItemLike } from "../../services/itemLike.js";

type Params = {
    itemId: number;
};

export const itemLikeCountUseCase = async ({ itemId }: Params) => {
    const count = await countItemLike({ itemId });

    return count;
};