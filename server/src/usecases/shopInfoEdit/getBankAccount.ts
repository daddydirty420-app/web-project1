import { AppError } from "../../errors.js";
import { getShopEditWithBankAccount } from "../../services/shopInfoEdit.js";

type Params = {
    shopEditId: number;
};

export const getBankAccountUseCase = async ({ shopEditId }: Params) => {
    const shopEdit = await getShopEditWithBankAccount({ shopEditId });

    if (!shopEdit) throw new AppError("SHOP_NOT_FOUND", 404);

    return { data: shopEdit.BankAccount };
};