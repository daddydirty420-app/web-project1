import { AppError } from "../../../errors.js";
import { getShopHasAddress } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
    userId: number;
};

export const getAddressShopUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getShopHasAddress({ shopId });

    const data = shop.Address;
    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return data;
};
