import { AppError } from "../../../errors.js";
import { getShopHasConName } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
};

export const getConNameUseCase = async ({ shopId }: Params) => {
    const shop = await getShopHasConName({ shopId });

    const name = shop.ContactName;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
