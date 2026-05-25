import { apiFetch } from "../../../../../lib/api/client";

type OptionBody = {
    autoTrans: boolean;
    openInfo: boolean;
};

export const fetchOptionEdit = async (shopId: string, body: OptionBody) => {
    return apiFetch(`/shop-info/${shopId}/option`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
