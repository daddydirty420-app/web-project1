import { InferAttributes, Op, Order, WhereOptions } from "sequelize";
import Item from "../../../models/item.js";
import { getSearchItems } from "../../../services/items/index.js";

type Params = {
    keyword: string;
    limit: number;
    cursorScore?: number;
    cursorId?: number;
    userId?: number;
};

export const getSearchItemsUseCase = async ({ keyword, limit, cursorScore, cursorId, userId }: Params) => {
    // 検索
    const where: WhereOptions<InferAttributes<Item>> =
        cursorScore !== undefined && cursorId !== undefined
            ? {
                  [Op.or]: [
                      { sort_number: { [Op.lt]: cursorScore } },
                      {
                          sort_number: cursorScore,
                          id: { [Op.gt]: cursorId },
                      },
                  ],
                  sort_number: { [Op.gte]: 0 },
                  status: ["active", "soldout"],
                  search_text: { [Op.iLike]: `%${keyword}%` },
                  ...(userId ? { seller_id: { [Op.ne]: userId } } : {}),
              }
            : {
                  sort_number: { [Op.gte]: 0 },
                  status: ["active", "soldout"],
                  search_text: { [Op.iLike]: `%${keyword}%` },
                  ...(userId ? { seller_id: { [Op.ne]: userId } } : {}),
              };

    const order = [
        ["sort_number", "DESC"],
        ["id", "ASC"],
    ] as Order;

    const items = await getSearchItems({ limit, where, order });

    const hasMore = items.length > limit;

    const slicedItems = hasMore ? items.slice(0, limit) : items;

    const lastItem = slicedItems[slicedItems.length - 1];

    const nextCursorScore = lastItem?.sort_number ?? null;
    const nextCursorId = lastItem?.id ?? null;

    return { itemList: slicedItems, nextCursorScore, nextCursorId, hasMore };
};
