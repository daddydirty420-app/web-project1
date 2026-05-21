import { apiFetchNoAuth } from "../../../lib/api/client";

export const fetchOnPlay = async (videoId: string) => {
    return apiFetchNoAuth(`/video/${videoId}/onplay`, {
        method: "PATCH",
    });
};
