import { Categories } from "../models/index.js";

type Level2Params = {
    parentId: number;
};

export const getLevel2 = async ({ parentId }: Level2Params) => {
    return Categories.findAll({
        where: {
            parent_id: parentId,
            level: 2,
        },
        order: [["sort_order", "ASC"]],
    });
};