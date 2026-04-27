import { AppError } from "../../../errors.js";
import { getGenderOptionAll } from "../../../services/genderOption.js";
import { getHonninEditUser } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

export const getHonninEditUseCase = async ({ userId }: Params) => {
    // user取得
    const user = await getHonninEditUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // GenderOption取得
    const genderAllOptions = await getGenderOptionAll();

    return { user, genderAllOptions };
};
