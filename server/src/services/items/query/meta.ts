import { Item, Video } from "../../../models/index.js";
import { ItemIdParams } from "../../../types/serviceType/items.js";

export const getMetadata = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: ["name", "price", "first_image_url"],
        include: [
            {
                model: Video,
                attributes: ["title", "summary"],
            },
        ],
    });
};