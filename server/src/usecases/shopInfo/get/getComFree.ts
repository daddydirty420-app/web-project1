import { AppError } from "../../../errors.js";
import { getComFreeOptionAll } from "../../../services/comOrFreeOption.js";
import { getShopHasComFree } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
};

export const getShopComFreeUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getShopHasComFree({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const comFree = await getComFreeOptionAll();

    return { shop, comFree };
};
