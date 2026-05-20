import { apiFetch } from "../../../lib/api/client";

export const fetchAddFollow = async (userId: string) => {
    return apiFetch(`/follow/${userId}`, {
        method: "POST",
    });
};

export const fetchRemoveFollow = async (userId: string) => {
    return apiFetch(`/follow/${userId}`, {
        method: "DELETE",
    });
};
