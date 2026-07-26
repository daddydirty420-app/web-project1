import { AppError } from "../../errors.js";
import { getUserHasBankAccount } from "../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /bank-account/myaccount
// summary: 口座情報取得
// page: /edit/account
export const getMyAccountUseCase = async ({ userId }: Params) => {
    const user = await getUserHasBankAccount({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    const account = user.BankAccount;

    if (!account) throw new AppError("MY_ACCOUNT_NOT_FOUND", 404);

    return account;
};
