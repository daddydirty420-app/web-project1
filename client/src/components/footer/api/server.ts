import { apiFetchServer } from "../../../lib/api/server";

type UnreadCountResponse = {
    unreadCount: number;
};

export const fetchUnreadCount = async (): Promise<UnreadCountResponse> => {
    return apiFetchServer("/notification/unread-count", {
        cache: "no-store",
    });
};
