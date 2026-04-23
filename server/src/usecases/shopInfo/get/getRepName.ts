import { AppError } from "../../../errors.js";
import { getShopHasRepName } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
};

export const getRepNameUseCase = async ({ shopId }: Params) => {
    const shop = await getShopHasRepName({ shopId });

    const name = shop.RepresentativeName;
    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
