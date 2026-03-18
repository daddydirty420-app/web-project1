import { getCartList } from "./handler/cart.js";
import { getDeletedItems } from "./handler/deleted.js";
import { getDraftItems } from "./handler/draft.js";
import { getLikeList } from "./handler/like.js";
import { getStockListItems } from "./handler/stock.js";
import { getUploadedItems } from "./handler/uploaded.js";
import { getWatchList } from "./handler/watchHistory.js";

export type ItemListType =
    | "cart"
    | "deleted"
    | "draft"
    | "like"
    | "stock"
    | "uploaded"
    | "watchHistory";

type Params = {
    type: ItemListType;
    page: number;
    userId: number | null;
    status?: string;
    keyword?: string;
};

export const getItems = async ({ type, page, userId, status, keyword }: Params) => {
    const handlerMap = {
        cart: getCartList,
        deleted: getDeletedItems,
        draft: getDraftItems,
        like: getLikeList,
        stock: getStockListItems,
        uploaded: getUploadedItems,
        watchHistory: getWatchList,
    };

    const handler = handlerMap[type];
    if (!handler) throw new Error("NOT_IMPLEMENTED");

    return await handler({ page, userId, status, keyword });
};