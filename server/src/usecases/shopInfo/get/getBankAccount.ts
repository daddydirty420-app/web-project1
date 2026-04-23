import { AppError } from "../../../errors.js";
import { getShopHasBankAccount } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
};

export const getBankAccountUseCase = async ({ shopId }: Params) => {
    const shop = await getShopHasBankAccount({ shopId });

    const data = shop.BankAccount;
    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
