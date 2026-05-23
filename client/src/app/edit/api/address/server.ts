import { apiFetchServer } from "../../../../lib/api/server";
import { Address } from "../../type";

type AddressPageResponse = {
    data: Address;
};

export const fetchAddressPage = async (): Promise<AddressPageResponse> => {
    return apiFetchServer("/address/myaddress", {
        cache: "no-store",
    });
};

export const fetchDeliveryAddressPage = async (deliveryId: string): Promise<AddressPageResponse> => {
    return apiFetchServer(`/address/${deliveryId}/delivery-address`, {
        cache: "no-store",
    });
};

export const fetchShopAddressPage = async (shopId: string): Promise<AddressPageResponse> => {
    return apiFetchServer(`/shop-info/${shopId}/address`, {
        cache: "no-store",
    });
};

export const fetchShopEditAddressPage = async (shopEditId: string): Promise<AddressPageResponse> => {
    return apiFetchServer(`/shop-info-edit/${shopEditId}/address`, {
        cache: "no-store",
    });
};
