import { AppError } from "../../../errors.js";
import { getShopOption } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
};

// GET /shop-info/:id/option
// summary: オプション取得
// page: /edit/shop/option/[id]
export const getShopOptionUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getShopOption({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return shop;
};
