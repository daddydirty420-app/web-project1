import { AppError } from "../../../errors.js";
import { getMePhoneNumber } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

export const getPhoneNumberUseCase = async ({ userId }: Params) => {
    const user = await getMePhoneNumber({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};