import { apiFetch } from "../../../lib/api/client";

export const fetchPublishItem = async (itemId: string) => {
    return apiFetch(`/items/${itemId}/publish`, {
        method: "PATCH",
    });
};
