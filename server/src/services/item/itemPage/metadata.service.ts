import { AppError } from "../../../errors.js";
import { Item, Video } from "../../../models/index.js";

type Params = {
    itemId: number;
};

export const getMetadata = async ({ itemId }: Params) => {

    const item = await Item.findByPk(itemId, {
        attributes: ["name", "price", "first_image_url"],
        include: [
            {
                model: Video,
                attributes: ["title", "summary"],
            },
        ],
    });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    return item;
};