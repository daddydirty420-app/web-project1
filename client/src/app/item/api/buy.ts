import { apiFetch } from "../../../lib/api/client";

type BuyResponse = {
    purchaseSessionId: number;
};

export const fetchBuy = async (itemId: string): Promise<BuyResponse> => {
    return apiFetch(`/purchase-session/${itemId}`, {
        method: "POST",
    });
};
