import { Item } from "../../../models/index.js";
import { ReccomendItemsview, recommendConfig } from "./items.config.js";

type Params = {
    userId: number | null;
    view: ReccomendItemsview;
};

export const getRecommendItems = async ({ userId, view }: Params) => {
    const config = recommendConfig[view];

    if (config.requireAuth && !userId) {
        throw new Error("UNAUTHORIZED");
    }

    const where = config.buildWhere({ userId });

    const items = await Item.findAll({
        attributes: config.attributes,
        where,
        limit: config.limit,
        order: config.order,
        include: config.include,
    });

    return items;
};