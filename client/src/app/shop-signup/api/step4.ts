import { apiFetch } from "../../../lib/api/client";

type OptionBody = {
    autoTrans: boolean;
    openInfo: boolean;
};

export const fetchStep4 = async (shopId: string, body: OptionBody) => {
    return apiFetch(`/shop-info/${shopId}/signup/4`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
