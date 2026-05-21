import { apiFetchNoAuth } from "../../../lib/api/client";
import { Items } from "../../../types/itemListTypes";

type Res = {
    items: Items[];
    totalPages: number;
};

export const fetchVL = async (page: number, limit: number): Promise<Res> => {
    return apiFetchNoAuth(`/items?type=video&page=${page}&view=index&limit=${limit}`, {
        method: "GET",
        cache: "no-store",
    });
};

export const fetchIL = async (page: number, limit: number): Promise<Res> => {
    return apiFetchNoAuth(`/items?type=item&page=${page}&view=index&limit=${limit}`, {
        method: "GET",
        cache: "no-store",
    });
};
