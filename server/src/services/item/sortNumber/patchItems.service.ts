import { AppError } from "../../../errors.js";
import { Item } from "../../../models/index.js";

type Params = {
    itemId: number;
    number: number;
};

export const patchSortNumber = async ({ itemId, number }: Params) => {
    const buzzNumber = number * 3;

    const item = await Item.findByPk(itemId);
    
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    if (item.status !== "soldout") {
        await item.update({
            sort_number: item.sort_number + number,
            sort_buzz_number: item.sort_buzz_number + buzzNumber,
        });
    }
};