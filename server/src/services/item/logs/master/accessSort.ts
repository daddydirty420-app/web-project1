import { Item } from "../../../../models/index.js";

type Params = {
    item: InstanceType<typeof Item>;
};

export const patchItemsAccess = async ({ item }: Params) => {
    item.views_count += 1;

    if (item.status !== "soldout") {
        const newSort = item.sort_number += 5;
        const newSortBuzz = item.sort_buzz_number += 30;

        if (item.recommend) {
            item.sort_number = newSort + 5;
            item.sort_buzz_number = newSortBuzz + 30;
        }
    }

    await item.save();
};