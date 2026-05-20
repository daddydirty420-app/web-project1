import { apiFetch } from "../../../lib/api/client";

type SaleBody = {
    discountRate: number;
    discountAmount: number;
    finalPrice: number;
};

type SaleEditParams = {
    saleId?: string;
    body: SaleBody;
};

export const fetchSaleEdit = async ({ saleId, body }: SaleEditParams) => {
    return apiFetch(`/sale/${saleId}/edit`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};

export const fetchSaleStop = async (saleId: string | undefined) => {
    return apiFetch(`/sale/${saleId}/stop`, {
        method: "PATCH",
    });
};
