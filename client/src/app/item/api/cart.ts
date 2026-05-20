import { apiFetch } from "../../../lib/api/client";

type StatusResponse = {
    status: boolean;
};

export const fetchGetCartStatus = async (itemId: string): Promise<StatusResponse> => {
    return apiFetch(`/cart/${itemId}/status`, {
        method: "GET",
        cache: "no-store",
    });
};
