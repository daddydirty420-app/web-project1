import { AppError } from "../../../errors.js";
import { getMyAccountOne, getShopAccountOne } from "../../../services/bankAccount.js";
import { getShop } from "../../../services/shopInfo/query.js";

type Params = {
    userId: number;
    shopId: number;
};

export const getShopSignup2UseCase = async ({ userId, shopId }: Params) => {
    // shop取得（確認用）
    const shop = await getShop({ shopId });
    
        if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
        if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // shopのbankAccount取得
    let data = await getShopAccountOne({ shopId });

    if (!data) {
        data = await getMyAccountOne({ userId });
    }

    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
