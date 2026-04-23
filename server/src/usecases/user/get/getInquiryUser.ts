import { AppError } from "../../../errors.js";
import { getInquiryUser } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

export const getInquiryUserUseCase = async ({ userId }: Params) => {
    // user取得
    const user = await getInquiryUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
