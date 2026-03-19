import { Item } from "../../../models/index.js";
import { ReccomendItemsview, recommendConfig } from "./items.config.js";

type Params = {
    userId: number | null;
    view: ReccomendItemsview;
    itemId?: number;
};

export const getRecommendItems = async ({ userId, view, itemId }: Params) => {
    const config = recommendConfig[view];

    if (config.requireAuth && !userId) {
        throw new Error("UNAUTHORIZED");
    }

    const query = await config.buildQuery({ userId, itemId });

    return await Item.findAll(query);
};