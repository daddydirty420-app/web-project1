import { apiFetch } from "../../../../lib/api/client";

export const fetchPhoneNumberEdit = async (phoneNumber: string) => {
    return apiFetch("/user/phone-number", {
        method: "PATCH",
        body: JSON.stringify({ phoneNumber }),
    });
};

export const fetchShopPhoneNumberEdit = async (shopId: string, phoneNumber: string) => {
    return apiFetch(`/shop-info/${shopId}/phone-number`, {
        method: "PATCH",
        body: JSON.stringify({ phoneNumber }),
    });
};
