import { AppError } from "../../errors.js";
import { getAddressShopOne } from "../../services/address.js";

type Params = {
    shopId: number;
};

export const getAddressShopUseCase = async ({ shopId }: Params) => {
    const data = await getAddressShopOne({ shopId });

    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return data;
};
