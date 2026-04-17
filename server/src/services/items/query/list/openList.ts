import { Item, Sale, User, Video } from "../../../../models/index.js";
import { ItemListParams } from "../../../../types/serviceType/items/items.js";

export const getIndexItemsWithCount = async ({ where, limit, offset }: ItemListParams) => {
    const items = await Item.findAll({
        attributes: ["id", "name", "price", "status", "uploaded_at", "seller_id", "first_image_url"],
        where,
        limit,
        offset,
        order: [["uploaded_at", "DESC"]],
        include: [
            {
                model: Video,
                attributes: ["thumbnail_url", "title", "duration"],
            },
            {
                model: Sale,
                attributes: ["sale_flag", "before_price", "discount_rate", "discount_amount"],
            },
            {
                model: User,
                attributes: ["user_name", "profile_image"],
            },
        ],
    });

    const totalCount = await Item.count({ where });

    return { items, totalCount };
};

export const getIndexVideosWithCount = async ({ where, limit, offset }: ItemListParams) => {
    const items = await Item.findAll({
        attributes: ["id", "name", "price", "status", "uploaded_at", "seller_id"],
        where,
        limit,
        offset,
        order: [["uploaded_at", "DESC"]],
        include: [
            {
                model: Video,
                attributes: ["thumbnail_url", "title", "duration"],
            },
            {
                model: Sale,
                attributes: ["sale_flag", "before_price", "discount_rate", "discount_amount"],
            },
        ],
    });

    const totalCount = await Item.count({ where });

    return { items, totalCount };
};

export const getProfileItemsWithCount = async ({ where, limit, offset }: ItemListParams) => {
    const items = await Item.findAll({
        attributes: ["id", "name", "price", "status", "uploaded_at", "seller_id", "first_image_url"],
        where,
        limit,
        offset,
        order: [["uploaded_at", "DESC"]],
        include: [
            {
                model: Sale,
                attributes: ["sale_flag", "discount_rate", "discount_amount"],
            },
        ],
    });

    const totalCount = await Item.count({ where });

    return { items, totalCount };
};

export const getProfileVideosWithCount = async ({ where, limit, offset }: ItemListParams) => {
    const items = await Item.findAll({
        attributes: ["id", "name", "price", "status", "uploaded_at", "seller_id"],
        where,
        limit,
        offset,
        order: [["uploaded_at", "DESC"]],
        include: [
            {
                model: Video,
                attributes: ["thumbnail_url", "title", "duration"],
            },
            {
                model: Sale,
                attributes: ["sale_flag", "before_price", "discount_rate", "discount_amount"],
            },
        ],
    });

    const totalCount = await Item.count({ where });

    return { items, totalCount };
};
