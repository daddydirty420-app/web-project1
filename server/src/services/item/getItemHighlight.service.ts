import { AppError } from "../../errors.js";
import { Item } from "../../models/index.js";

type Params = {
    itemId: number;
};

export const getItemHighlight = async ({ itemId }: Params) => {

    const item = await Item.findByPk(itemId, {
        attributes: ['id', 'name', 'price', "attributes", 'first_image_url', "gender_type", "age_type", "seller_id", "status"],
    });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    return item;
};