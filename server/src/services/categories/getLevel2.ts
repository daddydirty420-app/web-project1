import { AppError } from "../../errors.js";
import { Categories } from "../../models/index.js";

type Params = {
    parentId: number;
};

export const getLevel2 = async ({ parentId }: Params) => {

    const category2 = await Categories.findAll({
        where: {
            parent_id: parentId,
            level: 2,
        },
        order: [["sort_order", "ASC"]],
    });

    if (category2.length === 0) {
        throw new AppError("CATEGORY2_NOT_FOUND", 404);
    }

    return category2;
};