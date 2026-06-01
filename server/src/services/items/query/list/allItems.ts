import { Item, Sale, Video } from "../../../../models/index.js";
import { GetAllItemParams } from "../../../../types/serviceType/items.js";

export const getAllItems = ({ where, limit }: GetAllItemParams) => {
    return Item.findAll({
        where,
        limit,
        order: [["id", "ASC"]],
        include: [
            {
                model: Video,
                attributes: ["title"],
            },
            {
                model: Sale,
                attributes: ["discount_rate", "discount_amount", "sale_flag", "before_price"],
            },
        ],
    });
};
