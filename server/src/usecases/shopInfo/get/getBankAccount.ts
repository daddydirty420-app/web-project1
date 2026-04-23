import { AppError } from "../../../errors.js";
import { getShopHasBankAccount } from "../../../services/shopInfo.js";

type Params = {
    shopId: number;
    userId: number;
};

export const getBankAccountUseCase = async ({ shopId, userId }: Params) => {
    const shop = await getShopHasBankAccount({ shopId });

    const data = shop.BankAccount;
    if (!data) throw new AppError("BANK_ACCOUNT_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    return data;
};
