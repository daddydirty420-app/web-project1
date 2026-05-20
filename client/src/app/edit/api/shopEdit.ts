import { apiFetch } from "../../../lib/api/client";

export const companyNameEdit = async (shopId: string, companyName: string) => {
    return apiFetch(`/shop-info-edit/${shopId}/company-name`, {
        method: "POST",
        body: JSON.stringify({ companyName }),
    });
};
