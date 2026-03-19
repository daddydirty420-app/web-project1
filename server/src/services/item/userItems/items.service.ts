import { AppError } from "../../../errors.js";
import { getCartList } from "./master/cart.js";
import { getDeletedItems } from "./master/deleted.js";
import { getDraftItems } from "./master/draft.js";
import { getLikeList } from "./master/like.js";
import { getStockListItems } from "./master/stock.js";
import { getUploadedItems } from "./master/uploaded.js";
import { getWatchList } from "./master/watchHistory.js";

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

export const getMeItems = async ({ type, page, userId, status, keyword }: Params) => {
    const serviceMap = {
        cart: getCartList,
        deleted: getDeletedItems,
        draft: getDraftItems,
        like: getLikeList,
        stock: getStockListItems,
        uploaded: getUploadedItems,
        watchHistory: getWatchList,
    };

    const service = serviceMap[type];
    if (!service) throw new AppError("NOT_IMPLEMENTED", 400);

    return await service({ page, userId, status, keyword });
};