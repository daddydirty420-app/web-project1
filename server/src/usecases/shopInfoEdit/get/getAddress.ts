import { AppError } from "../../../errors.js";
import { getShopEditHasAddress } from "../../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
    userId: number;
};

export const getAddressShopEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditHasAddress({ shopEditId });

    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const data = shopEdit.Address;
    if (!data) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return data;
};
