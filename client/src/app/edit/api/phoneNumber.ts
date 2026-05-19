import { apiFetch } from "../../../lib/api/client";

export const phoneNumberEdit = async (phoneNumber: string) => {
    return apiFetch("/user/phone-number", {
        method: "PATCH",
        body: JSON.stringify({ phoneNumber }),
    });
};

export const shopPhoneNumberEdit = async (shopId: string, phoneNumber: string) => {
    return apiFetch(`/shop-info/${shopId}/phone-number`, {
        method: "PATCH",
        body: JSON.stringify({ phoneNumber }),
    });
};
