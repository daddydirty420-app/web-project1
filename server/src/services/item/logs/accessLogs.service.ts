import { createWatchHistory } from "../../../usecases/watchHistory/create.js";
import { AppError } from "../../../errors.js";
import { Item } from "../../../models/index.js";
import { patchItemsAccess } from "./master/accessSort.js";

type Params = {
    itemId: number;
    userId: number | null;
};

export const patchItemLogsAccess = async ({ itemId, userId }: Params) => {

    const item = await Item.findByPk(itemId);
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    await createWatchHistory({ itemId, userId });

    if (item.seller_id !== userId) {
        await patchItemsAccess({ item });
    }
};