import { createItemLike, findItemLike } from "../../services/itemLike.js";
import { AppError } from "../../errors.js";
import { patchSortNumberAdd } from "../../services/item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const addItemLikeUseCase = async ({ itemId, userId }: Params) => {

    const data = await findItemLike({ itemId, userId });

    if (data) {
        throw new AppError("ALREADY_LIKE_ITEM", 409, "すでにいいね済みです");
    }

    await createItemLike({ itemId, userId });

    const number = 50;
    const buzzNumber = 200;

    patchSortNumberAdd({ itemId, number, buzzNumber }).catch((err) => {
        console.error("patchSortNumberAdd error:", err);
    });
}