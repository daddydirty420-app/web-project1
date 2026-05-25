import { apiFetchServer } from "../../../../lib/api/server";
import { Name } from "../../type";

type NamePageResponse = {
    name: Name;
};

export const fetchNamePage = async (): Promise<NamePageResponse> => {
    return apiFetchServer("/name/myname", {
        cache: "no-store",
    });
};

export const fetchDeliveryNamePage = async (deliveryId: string): Promise<NamePageResponse> => {
    return apiFetchServer(`/name/${deliveryId}/delivery-name`, {
        cache: "no-store",
    });
};

export const fetchShopConNamePage = async (shopId: string): Promise<NamePageResponse> => {
    return apiFetchServer(`/shop-info/${shopId}/con-name`, {
        cache: "no-store",
    });
};

export const fetchShopEditConNamePage = async (shopEditId: string): Promise<NamePageResponse> => {
    return apiFetchServer(`/shop-info-edit/${shopEditId}/con-name`, {
        cache: "no-store",
    });
};
