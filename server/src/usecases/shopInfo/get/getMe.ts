import { AppError } from "../../../errors.js";
import { getMeShop } from "../../../services/shopInfo/query.js";

type Params = {
    userId: number;
};

// GET /shop-info/me
// summary: ショップの有無とidを取得
// page: /link/edit/shop
export const getShopMeUseCase = async ({ userId }: Params) => {
    // ショップ取得
    const shop = await getMeShop({ userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return shop;
};
