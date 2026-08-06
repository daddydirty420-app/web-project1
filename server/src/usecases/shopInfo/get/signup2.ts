import { AppError } from "../../../errors.js";
import { getMyShopHasBankAccount } from "../../../services/shopInfo/query.js";
import { getUserHasBankAccount } from "../../../services/users/query.js";

type Params = {
    userId: number;
    shopId: number;
};

// GET /shop-info/:id/signup/2
// summary: ショップ口座登録ページ インプット表示データ取得
// page: /shop-signup/step2/[id]
export const getShopSignup2UseCase = async ({ userId, shopId }: Params) => {
    // shop取得（確認用）
    const shop = await getMyShopHasBankAccount({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    // shopのbankAccount取得
    let account = shop.BankAccount ?? undefined;

    if (!account) {
        const user = await getUserHasBankAccount({ userId });

        if (!user) throw new AppError("USER_NOT_FOUND", 404);

        account = user.BankAccount;
    }

    if (!account) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return account;
};
