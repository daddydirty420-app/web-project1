import { AppError } from "../../../errors.js";
import { getShopSignup5 } from "../../../services/shopInfo/query.js";

type Params = {
    userId: number;
    shopId: number;
};

// GET /shop-info/:id/signup/5
// summary: ショップ登録確認ページデータ取得
// page: /shop-signup/step5/[id]
export const getShopSignup5UseCase = async ({ userId, shopId }: Params) => {
    // shop取得
    const shop = await getShopSignup5({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    return shop;
};
