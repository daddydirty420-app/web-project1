import { apiFetch } from "../../../lib/api/client";

type AddressResponse = {
    address: {
        todouhuken_id: number;
        todouhuken_name: string;
        shikutyouson: string;
    };
};

type AddressEditBody = {
    postNumber: string;
    todouhuken: string;
    shikutyouson: string;
    banchi: string;
    building: string;
};

export const getAddress = async (postNumber: string) => {
    const data: AddressResponse = await apiFetch(`/address/search?zipcode=${postNumber}`, {
        method: "GET",
        cache: "no-store",
    });

    return data.address;
};

export const addressEdit = async (addressId: string, body: AddressEditBody) => {
    return apiFetch(`/address/${addressId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};

export const shopAddressEdit = async (shopId: string, body: AddressEditBody) => {
    return apiFetch(`/shop-info-edit/${shopId}/address`, {
        method: "POST",
        body: JSON.stringify(body),
    });
};
