import { apiFetchNoAuth } from "../../../lib/api/client";
import { Items } from "../../../types/itemListTypes";

type ItemListParams = {
    page: number;
    limit: number;
    userId: string;
};

type Res = {
    items: Items[] | null;
    hasItemCount: number;
    totalPages: number;
};

export const fetchVL = async ({ page, limit, userId }: ItemListParams): Promise<Res> => {
    return apiFetchNoAuth(`/items?type=video&page=${page}&view=profile&limit=${limit}&pageUserId=${userId}`, {
        method: "GET",
        cache: "no-store",
    });
};

export const fetchIL = async ({ page, limit, userId }: ItemListParams): Promise<Res> => {
    return apiFetchNoAuth(`/items?type=item&page=${page}&view=profile&limit=${limit}&pageUserId=${userId}`, {
        method: "GET",
        cache: "no-store",
    });
};
