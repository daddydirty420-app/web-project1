import { apiFetch } from "../../../lib/api/client";

export const fetchAdminDeleteItem = async (itemId: string, deleteReason: string) => {
    return apiFetch(`/admin/items/${itemId}`, {
        method: "DELETE",
        body: JSON.stringify({ deleteReason }),
    });
};

export const fetchPerfectDeleteItem = async (itemId: string) => {
    return apiFetch(`/items/${itemId}/perfect`, {
        method: "DELETE",
    });
};

export const fetchRestoreItem = async (itemId: string) => {
    return apiFetch(`/items/${itemId}/restore`, {
        method: "PATCH",
    });
};
