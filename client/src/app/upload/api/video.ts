import { apiFetch } from "../../../lib/api/client";

export const fetchVideoConvert = async (videoId: string) => {
    return apiFetch(`/video/${videoId}/convert`, {
        method: "PATCH",
    });
};
