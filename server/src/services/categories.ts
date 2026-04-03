import { Level2Params } from "../types/serviceType/categories.js";
import { Categories } from "../models/index.js";

export const getLevel2 = async ({ parentId }: Level2Params) => {
    return Categories.findAll({
        where: {
            parent_id: parentId,
            level: 2,
        },
        order: [["sort_order", "ASC"]],
    });
};

export const findAllLevel1 = async () => {
    return Categories.findAll({
        where: { level: 1 },
        order: [["sort_order", "ASC"]],
    });
};