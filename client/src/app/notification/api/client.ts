import { apiFetch } from "../../../lib/api/client";

export const fetchReadTrue = async (notificationId: string) => {
    return apiFetch(`/notification/${notificationId}/read-flag`, {
        method: "PATCH",
    });
};
