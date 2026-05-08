import { AppError } from "../../errors.js";
import { getMyAccountOne } from "../../services/bankAccount.js";

type Params = {
    userId: number;
};

// GET /bank-account/myaccount
// summary: 口座情報取得
// page: /edit/account
export const getMyAccountUseCase = async ({ userId }: Params) => {
    const data = await getMyAccountOne({ userId });

    if (!data) throw new AppError("MY_ACCOUNT_NOT_FOUND", 404);

    return data;
};
