import { AppError } from "../../../errors.js";
import { getMyShopId } from "../../../services/shopInfo/query.js";

type Params = {
    userId: number;
};

// GET /shop-info/my
// summary: ショップのidを取得
// page: /link/edit/shop
export const getMyShopIdUseCase = async ({ userId }: Params) => {
    // ショップ取得
    const shop = await getMyShopId({ userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    return shop;
};
