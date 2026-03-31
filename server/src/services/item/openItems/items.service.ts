import { AppError } from "../../../errors.js";
import { Item } from "../../../models/index.js";
import { ItemListView, viewItemsConfig, viewVideosConfig } from "./items.config.js";

type Params = {
    userId: number | null;
    type: "video" | "item";
    page: number;
    view: ItemListView;
    limit: number;
    pageUserId?: number;
};

export const getOpenItems = async ({ userId, type, limit, page, view, pageUserId }: Params) => {
    const config = type === "video"
    ? viewVideosConfig[view]
    : viewItemsConfig[view];

    if (!config) throw new AppError("INVALID_VIEW", 400);

    const offset = (page - 1) * limit;

    const where = config.buildWhere({ userId, pageUserId });

    const items = await Item.findAll({
        attributes: config.attributes,
        where,
        limit,
        offset,
        order: config.order,
        include: config.include,
    });

    const totalCount = await Item.count({ where });

    return {
        items,
        totalPages: Math.ceil(totalCount / limit),
    };
};