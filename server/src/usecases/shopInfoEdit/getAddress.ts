import { AppError } from "../../errors.js";
import { getAddressShopEditOne } from "../../services/address.js";

type Params = {
    shopEditId: number;
};

export const getAddressShopEditUseCase = async ({ shopEditId }: Params) => {
    const data = await getAddressShopEditOne({ shopEditId });

    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return data;
};
