import { apiFetch } from "../../../lib/api/client";

export const fetchAdminDeleteItem = async (itemId: string, deleteReason: string) => {
    return apiFetch(`/admin/items/${itemId}`, {
        method: "DELETE",
        body: JSON.stringify({ deleteReason }),
    });
};
