import { AppError } from "../../errors.js";
import { getBankAccountShopOne } from "../../services/bankAccount.js";

type Params = {
    shopId: number;
};

export const getBankAccountUseCase = async ({ shopId }: Params) => {
    const data = await getBankAccountShopOne({ shopId });

    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);

    return data;
};
