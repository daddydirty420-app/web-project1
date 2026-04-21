import { AppError } from "../../errors.js";
import { getBankAccountShopEditOne } from "../../services/bankAccount.js";

type Params = {
    shopEditId: number;
};

export const getBankAccountUseCase = async ({ shopEditId }: Params) => {
    const data = await getBankAccountShopEditOne({ shopEditId });

    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
