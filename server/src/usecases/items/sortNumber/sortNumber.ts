import { getItem, updateSortNumber } from "../../../services/items/index.js";
import { AppError } from "../../../errors.js";

type Params = {
    itemId: number;
    number: number;
    buzzNumber?: number;
};

// PATCH /items/:id/sort-number/add?number=number
// summary: sortNumber追加
// page: /itemなど
export const patchSortNumberAddUseCase = async ({ itemId, number, buzzNumber }: Params) => {
    const item = await getItem({ itemId });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    const sortBuzzNumber = buzzNumber || number * 3;

    const newSortNumber = item.sort_number + number;
    const newSortBuzzNumber = item.sort_buzz_number + sortBuzzNumber;

    if (item.status === "active") {
        updateSortNumber({
            item,
            data: {
                sort_number: newSortNumber,
                sort_buzz_number: newSortBuzzNumber,
            },
        }).catch((err) => {
            console.error("service Item updateSortNumber error:", err);
        });
    }
};

// PATCH /items/:id/sort-number/decrease?number=number
// summary: sortNumber減少
// page: /itemなど
export const patchSortNumberDecreaseUseCase = async ({ itemId, number, buzzNumber }: Params) => {
    const item = await getItem({ itemId });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    const sortBuzzNumber = buzzNumber || number * 3;

    const newSortNumber = item.sort_number - Math.min(item.sort_number, number);
    const newSortBuzzNumber = item.sort_buzz_number - Math.min(item.sort_buzz_number, sortBuzzNumber);

    if (item.status === "active") {
        updateSortNumber({
            item,
            data: {
                sort_number: newSortNumber,
                sort_buzz_number: newSortBuzzNumber,
            },
        }).catch((err) => {
            console.error("service Item updateSortNumber error:", err);
        });
    }
};
