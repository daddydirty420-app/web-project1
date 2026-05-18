import { apiFetch } from "../../../lib/api/client";

export const addFollow = async (userId: string) => {
    return apiFetch(`/follow/${userId}`, {
        method: "POST",
    });
};

export const removeFollow = async (userId: string) => {
    return apiFetch(`/follow/${userId}`, {
        method: "DELETE",
    });
};
