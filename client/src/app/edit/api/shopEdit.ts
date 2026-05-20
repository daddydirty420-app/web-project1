import { apiFetch } from "../../../lib/api/client";

type ComFreeResponse = {
    editId: number;
};

export const fetchCompanyNameEdit = async (shopId: string, companyName: string) => {
    return apiFetch(`/shop-info-edit/${shopId}/company-name`, {
        method: "POST",
        body: JSON.stringify({ companyName }),
    });
};

export const fetchComFreeEdit = async (shopId: string, selectOption: number): Promise<ComFreeResponse> => {
    return apiFetch(`/shop-info-edit/${shopId}/com-free`, {
        method: "POST",
        body: JSON.stringify({ selectOption }),
    });
};
