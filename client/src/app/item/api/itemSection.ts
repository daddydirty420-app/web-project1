import { apiFetchNoToken } from "../../../lib/api/client";

export const fetchItemSort = async (itemId: string, sortNumber: number) => {
    return apiFetchNoToken(`/items/${itemId}/sort-number/add?number=${sortNumber}`, {
        method: "PATCH",
    });
};
