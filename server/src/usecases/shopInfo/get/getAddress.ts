import { AppError } from "../../../errors.js";
import { getShopHasAddress } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
};

export const getAddressShopUseCase = async ({ shopId }: Params) => {
    const shop = await getShopHasAddress({ shopId });

    const data = shop.Address;
    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return data;
};
