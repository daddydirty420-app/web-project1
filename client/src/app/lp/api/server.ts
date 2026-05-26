import { apiFetchServerNoAuth } from "../../../lib/api/server";
import { Items } from "../../../types/itemListTypes";

type LpResponse = {
    items: Items[];
    totalPages: number;
};

type HasShopResponse = {
    hasShop: boolean;
};

export const fetchLpVideoList = async (): Promise<LpResponse> => {
    return apiFetchServerNoAuth("/item-list/index-item-list/video-list?page=1&limit=15", {
        next: { revalidate: 300 },
    });
};

export const fetchGetHasShop = async (): Promise<HasShopResponse> => {
    return apiFetchServerNoAuth("/shop-info/has-shop/me", {
        cache: "no-store",
    });
};
