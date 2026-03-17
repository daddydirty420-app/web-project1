import { getCartList } from "./handler/cart.js";
import { getDeletedItems } from "./handler/deleted.js";
import { getDraftItems } from "./handler/draft.js";
import { getLikeList } from "./handler/like.js";
import { getStockListItems } from "./handler/stock.js";
import { getUploadedItems } from "./handler/uploaded.js";
import { getWatchList } from "./handler/watchHistory.js";
import { itemListConfig, ItemListType } from "./itemList.config.js";

type Params = {
    type: ItemListType;
    page: number;
    userId: number | null;
    statusList?: string[];
    keyword?: string;
};

export const getItemList = async ({ type, page, userId, statusList, keyword }: Params) => {
    const config = itemListConfig[type];

    if (!config) throw new Error("INVALID_TYPE");

    if (config.requireAuth && !userId) {
        throw new Error("UNAUTHORIZED");
    }

    switch (type) {
        case "cart": return await getCartList({ page, userId, keyword });
        case "deleted": return await getDeletedItems({ page, userId, keyword });
        case "draft": return await getDraftItems({ page, userId, keyword });
        case "like": return await getLikeList({ page, userId, keyword });
        case "stock": return await getStockListItems({ page, userId, keyword });
        case "uploaded": return await getUploadedItems({ page, userId, statusList, keyword });
        case "watchHistory": return await getWatchList({ page, userId, keyword });

        default: throw new Error("NOT_IMPLEMENTED");
    }
};