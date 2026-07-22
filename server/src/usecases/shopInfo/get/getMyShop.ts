import { AppError } from "../../../errors.js";
import { getMyShop } from "../../../services/shopInfo/query.js";

type Params = {
    userId: number;
};

// GET /shop-info/my
// summary: ショップのidを取得
// page: /link/edit/shop
export const getMyShopUseCase = async ({ userId }: Params) => {
    // ショップ取得
    const shop = await getMyShop({ userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return shop;
};
