import { AppError } from "../../errors.js";
import { getMyNameOne } from "../../services/name.js";

type Params = {
    userId: number;
};

// GET /name/myname
// summary: 自分の氏名取得
// page: /edit/nameなど
export const getMyNameUseCase = async ({ userId }: Params) => {
    const data = await getMyNameOne({ userId });

    if (!data) throw new AppError("NAME_NOT_FOUND", 404);

    return data;
};
