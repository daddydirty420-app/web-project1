import { AppError } from "../../../errors.js";
import { getMyShopOption } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
};

// GET /shop-info/:id/option
// summary: オプション取得
// page: /edit/shop/option/[id]
export const getShopOptionUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getMyShopOption({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    return shop;
};
