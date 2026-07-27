import { AppError } from "../../errors.js";
import { getUserHasName } from "../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /name/myname
// summary: 自分の氏名取得
// page: /edit/nameなど
export const getMyNameUseCase = async ({ userId }: Params) => {
    const user = await getUserHasName({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    const name = user.Name;

    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    return name;
};
