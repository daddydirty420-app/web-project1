import { Item } from "../../../../models/index.js";
import { FormDataMode } from "../items.service.js";
import { ItemDetailInclude, normalInclude } from "../items.query.js";

type Params = {
    itemId: number;
    mode: FormDataMode;
};

export const getItemByMode = async ({ itemId, mode }: Params) => {
    const attributes = mode === "normal"
    ? ["id", "seller_id", "status"]
    : ["id", "name", "detail", "image_url", "price", "seller_id", "gender_type", "age_type", "status", "attributes"];

    const include = mode === "normal"
    ? normalInclude
    : ItemDetailInclude;

    const item = await Item.findByPk(itemId, {
        attributes,
        include,
    });

    return item;
};