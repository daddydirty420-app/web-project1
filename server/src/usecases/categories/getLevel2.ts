import { getLevel2 } from "../../services/categories.js";
import { AppError } from "../../errors.js";

type Params = {
    parentId: number;
};

export const getLevel2UseCase = async ({ parentId }: Params) => {
    const category2 = await getLevel2({ parentId });

    if (category2.length === 0) {
        throw new AppError("CATEGORY2_NOT_FOUND", 404);
    }

    return category2;
};
