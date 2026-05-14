import { AppError } from "../../../errors.js";
import { getShopEditHasBankAccount } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/bank-account
// summary: shopEdit口座情報取得
// page: /edit/account/shop/com-free/[id]
export const getBankAccountShopEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditHasBankAccount({ shopEditId });

    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const data = shopEdit.BankAccount;
    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
