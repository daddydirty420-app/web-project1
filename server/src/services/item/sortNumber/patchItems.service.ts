import { AppError } from "../../../errors.js";
import { Item } from "../../../models/index.js";

type Params = {
    itemId: number;
    number: number;
    buzzNumber?: number;
};

export const patchSortNumberAdd = async ({ itemId, number, buzzNumber }: Params) => {
    const sortBuzzNumber = buzzNumber || (number * 3);

    const item = await Item.findByPk(itemId);
    
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    if (item.status === "active") {
        await item.update({
            sort_number: item.sort_number + number,
            sort_buzz_number: item.sort_buzz_number + sortBuzzNumber,
        });
    }
};

export const patchSortNumberDecrease = async ({ itemId, number, buzzNumber }: Params) => {
    const sortBuzzNumber = buzzNumber || (number * 3);

    const item = await Item.findByPk(itemId);
    
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    if (item.status === "active") {
        await item.update({
            sort_number: item.sort_number - Math.min(item.sort_number, number),
            sort_buzz_number: item.sort_buzz_number - Math.min(item.sort_buzz_number, sortBuzzNumber),
        });
    }
};