import { AppError } from "../../errors.js";
import { getShopEditHasBankAccount } from "../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
};

export const getBankAccountShopEditUseCase = async ({ shopEditId }: Params) => {
    const shopEdit = await getShopEditHasBankAccount({ shopEditId });

    const data = shopEdit.BankAccount;
    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
