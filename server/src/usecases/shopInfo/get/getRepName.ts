import { AppError } from "../../../errors.js";
import { getShopHasRepName } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
};

export const getRepNameUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getShopHasRepName({ shopId });

    const name = shop.RepresentativeName;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return { shop, name };
};
