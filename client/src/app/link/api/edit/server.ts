import { apiFetchServer } from "../../../../lib/api/server";
import { ShopInfo } from "../../../edit/type";

type MyShopResponse = {
    shop: ShopInfo;
};

export const fetchMyShop = async (): Promise<MyShopResponse> => {
    return apiFetchServer("/shop-info/my", {
        cache: "no-store",
    });
};
