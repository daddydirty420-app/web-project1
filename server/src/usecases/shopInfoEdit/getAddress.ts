import { AppError } from "../../errors.js";
import { getShopEditHasAddress } from "../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
};

export const getAddressShopEditUseCase = async ({ shopEditId }: Params) => {
    const shopEdit = await getShopEditHasAddress({ shopEditId });

    const data = shopEdit.Address;
    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return data;
};
