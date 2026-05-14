import { AppError } from "../../../errors.js";
import { getShopHasComFree } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
};

// GET /shop-info/:id/company-name
// summary: 会社名取得
// page: /edit/shop/company-name/[id]
export const getCompanyNameUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getShopHasComFree({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return shop;
};
