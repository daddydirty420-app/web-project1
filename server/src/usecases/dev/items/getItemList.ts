import { Op } from "sequelize";
import { getAllItems } from "../../../services/items/index.js";

type Params = {
    limit: number;
    cursor?: number;
};

export class getAllItemListUseCase {
    async execute({ limit, cursor }: Params) {
        const where = cursor
            ? {
                  id: { [Op.gt]: cursor },
              }
            : {};

        const allItems = await getAllItems({ limit: limit + 1, where });

        const hasMore = allItems.length > limit;

        const slicedAllItems = hasMore ? allItems.slice(0, limit) : allItems;

        const lastItem = slicedAllItems[slicedAllItems.length - 1];

        const nextCursor = lastItem?.id ?? null;

        return { itemList: slicedAllItems, nextCursor, hasMore };
    }
}
