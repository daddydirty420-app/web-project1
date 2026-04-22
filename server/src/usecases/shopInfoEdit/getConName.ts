import { AppError } from "../../errors.js";
import { getShopEditHasConName } from "../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
};

export const getConNameEditUseCase = async ({ shopEditId }: Params) => {
    const shopEdit = await getShopEditHasConName({ shopEditId });

    const name = shopEdit.ShopInfo.ContactName;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
