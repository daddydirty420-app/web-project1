import { AppError } from "../../../errors.js";
import { getMyShopPhoneNumber } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
};

// GET /shop-info/:id/phone-number
// summary: 電話番号取得
// page: /edit/phone-number/shop/[id]
export const getShopPhoneNumberUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getMyShopPhoneNumber({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    return shop;
};
