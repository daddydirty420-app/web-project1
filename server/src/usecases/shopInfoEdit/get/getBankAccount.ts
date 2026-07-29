import { AppError } from "../../../errors.js";
import { getMyShopEditHasBankAccount } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

// GET /shop-info-edit/:id/bank-account
// summary: shopEdit口座情報取得
// page: /edit/account/shop/com-free/[id]
export const getBankAccountShopEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getMyShopEditHasBankAccount({ shopEditId, userId });

    if (!shopEdit) throw new AppError("SHOP_EDIT_NOT_FOUND", 404);

    const data = shopEdit.BankAccount;
    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
