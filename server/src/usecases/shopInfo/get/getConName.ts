import { AppError } from "../../../errors.js";
import { getShopHasConName } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
    userId: number;
};

export const getConNameUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getShopHasConName({ shopId });

    const name = shop.ContactName;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return name;
};
