import { AppError } from "../../../errors.js";
import { getItemHighlight } from "../../../services/items/index.js";

type Params = {
    itemId: number;
};

export const getItemHighlightUseCase = async ({ itemId }: Params) => {
    const item = await getItemHighlight({ itemId });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    return item;
};
