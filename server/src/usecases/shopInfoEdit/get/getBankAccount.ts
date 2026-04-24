import { AppError } from "../../../errors.js";
import { getShopEditHasBankAccount } from "../../../services/shopInfoEdit/query.js";

type Params = {
    shopEditId: number;
    userId: number;
};

export const getBankAccountShopEditUseCase = async ({ shopEditId, userId }: Params) => {
    const shopEdit = await getShopEditHasBankAccount({ shopEditId });

    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const data = shopEdit.BankAccount;
    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
