import { AppError } from "../../errors.js";
import { getMyAccountOne } from "../../services/bankAccount.js";

type Params = {
    userId: number;
};

export const getMyAccountUseCase = async ({ userId }: Params) => {
    const data = await getMyAccountOne({ userId });

    if (!data) throw new AppError("MY_ACCOUNT_NOT_FOUND", 404);

    return data;
};
