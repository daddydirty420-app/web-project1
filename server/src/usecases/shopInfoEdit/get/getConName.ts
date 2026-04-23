import { AppError } from "../../../errors.js";
import { getShopEditHasConName } from "../../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
    userId: number;
};

export const getConNameEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditHasConName({ shopEditId });

    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const name = shopEdit.ShopInfo.ContactName;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
