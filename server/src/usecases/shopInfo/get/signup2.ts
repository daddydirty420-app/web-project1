import { AppError } from "../../../errors.js";
import { getMyAccountOne, getShopAccountOne } from "../../../services/bankAccount.js";
import { getShop } from "../../../services/shopInfo/query.js";

type Params = {
    userId: number;
    shopId: number;
};

// GET /shop-info/signup/2/:id
// summary: ショップ口座登録ページ　インプット表示データ取得
// page: /shop-signup/step2/[id]
export const getShopSignup2UseCase = async ({ userId, shopId }: Params) => {
    // shop取得（確認用）
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // shopのbankAccount取得
    let account = await getShopAccountOne({ shopId });

    if (!account) {
        account = await getMyAccountOne({ userId });
    }

    if (!account) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return account;
};
