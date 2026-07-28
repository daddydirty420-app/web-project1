import { apiFetchServer } from "../../../../lib/api/server";
import { Name, ShopInfo } from "../../type";

type NamePageResponse = {
    name: Name;
};

type RepNameResponse = {
    name: Name;
    shop: ShopInfo;
};

export const fetchNamePage = async (): Promise<NamePageResponse> => {
    return apiFetchServer("/user/myname", {
        cache: "no-store",
    });
};

export const fetchDeliveryNamePage = async (deliveryId: string): Promise<NamePageResponse> => {
    return apiFetchServer(`/delivery/${deliveryId}/name`, {
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

export const fetchShopRepNamePage = async (shopId: string): Promise<RepNameResponse> => {
    return apiFetchServer(`/shop-info/${shopId}/rep-name`, {
        cache: "no-store",
    });
};

export const fetchShopEditRepNamePage = async (shopEditId: string): Promise<NamePageResponse> => {
    return apiFetchServer(`/shop-info-edit/${shopEditId}/rep-name`, {
        cache: "no-store",
    });
};
