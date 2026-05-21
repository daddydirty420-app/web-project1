import { apiFetch } from "../../../lib/api/client";

export const fetchItemLikeAdd = async (itemId: string) => {
    return apiFetch(`/item-like/${itemId}`, {
        method: "POST",
    });
};

export const fetchItemLikeRemove = async (itemId: string) => {
    return apiFetch(`/item-like/${itemId}`, {
        method: "DELETE",
    });
};
