import {
    apiFetchServer,
    apiFetchServerNoAuth,
    apiFetchServerNoAuthPatch,
    apiFetchServerNoToken,
} from "../../../lib/api/server";
import { Items } from "../../../types/itemListTypes";
import { Item, User } from "../itemPageTypes";

type MetadataResponse = {
    item: Item;
};

type ItemPageResponse = {
    item: Item;
    sellerMe: boolean;
    commentCount: number;
    likeCount: number;
    isLikeByMe: boolean;
    me: User;
};

type AdminItemPageResponse = {
    item: Item;
    commentCount: number;
    likeCount: number;
    reportCount: number;
};

type RecommendResponse = {
    items: Items[];
};

export const fetchItemMetadata = async (itemId: string): Promise<MetadataResponse> => {
    return apiFetchServerNoToken(`/items/${itemId}/metadata`, {
        cache: "no-store",
    });
};

export const fetchItemPage = async (itemId: string): Promise<ItemPageResponse> => {
    return apiFetchServerNoAuth(`/items/${itemId}?mode=normal`, {
        cache: "no-store",
    });
};

export const fetchItemPageSeller = async (itemId: string, mode: string): Promise<ItemPageResponse> => {
    return apiFetchServer(`/items/${itemId}?mode=${mode}`, {
        cache: "no-store",
    });
};

export const fetchAdminItemPage = async (itemId: string): Promise<AdminItemPageResponse> => {
    return apiFetchServer(`/admin/items/${itemId}/item-page`, {
        cache: "no-store",
    });
};

export const fetchRecommend = async (itemId: string): Promise<RecommendResponse> => {
    return apiFetchServerNoAuth(`/items/recommend?view=itemPage&itemId=${itemId}`, {
        cache: "no-store",
    });
};

export const fetchAccessLog = async (itemId: string) => {
    return apiFetchServerNoAuthPatch(`/items/${itemId}/logs/access`);
};
