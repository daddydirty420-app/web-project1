import { Item } from "../models/index.js";
import { ItemIdParams } from "../types/serviceType/items.js";

type UpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
    };
};

export const findByPkItem = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk({ itemId });
};

export const updateSortNumber = async ({ item, data }: UpdateParams) => {
    await item.update(data);
};