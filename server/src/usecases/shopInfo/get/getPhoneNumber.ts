import { AppError } from "../../../errors.js";
import { getShopPhoneNumber } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
};

export const getShopPhoneNumberUseCase = async ({ shopId }: Params) => {
    const shop = await getShopPhoneNumber({ shopId });

    if (!shop) {
        throw new AppError("SHOP_INFO_NOT_FOUND", 404);
    }

    return shop;
};
