import { AppError } from "../../errors.js";
import { getShopWithBankAccount } from "../../services/shopInfo.js";

type Params = {
    shopId: number;
};

export const getBankAccountUseCase = async ({ shopId }: Params) => {
    const shop = await getShopWithBankAccount({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    return { data: shop.BankAccount };
};