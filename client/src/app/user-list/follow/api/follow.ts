import { apiFetch } from "../../../../lib/api/client";

export const removeFollow = async (userId: string) => {
    return apiFetch(`/follow/${userId}`, {
        method: "DELETE",
    });
};
