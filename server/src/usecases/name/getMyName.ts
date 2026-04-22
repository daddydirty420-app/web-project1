import { AppError } from "../../errors.js";
import { getMyNameOne } from "../../services/name.js";

type Params = {
    userId: number;
};

export const getMyNameUseCase = async ({ userId }: Params) => {
    const data = await getMyNameOne({ userId });

    if (!data) throw new AppError("NAME_NOT_FOUND", 404);

    return data;
};
