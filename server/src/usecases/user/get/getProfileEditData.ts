import { AppError } from "../../../errors.js";
import { getProfileEditData } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

export const getProfileEditDataUseCase = async ({ userId }: Params) => {
    const user = await getProfileEditData({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
