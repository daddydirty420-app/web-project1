import { apiFetchServerNoAuth } from "../../../lib/api/server";

type UnreadCountResponse = {
    unreadCount: number;
};

export const fetchUnreadCount = async (): Promise<UnreadCountResponse> => {
    return apiFetchServerNoAuth("/notification/unread-count", {
        cache: "no-store",
    });
};
