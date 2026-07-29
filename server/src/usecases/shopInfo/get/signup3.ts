import { AppError } from "../../../errors.js";
import { getMyShopIdCard } from "../../../services/shopInfo/query.js";

type Params = {
    userId: number;
    shopId: number;
};

// GET /shop-info/:id/signup/3
// summary: ショップ口座登録ページ　インプット表示データ取得
// page: /shop-signup/step3/[id]
export const getShopSignup3UseCase = async ({ userId, shopId }: Params) => {
    // shop取得
    const shop = await getMyShopIdCard({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    return shop;
};
