import { Item, Sale, User, Video } from "../../../../models/index.js";
import { SearchItemParams } from "../../../../types/serviceType/items.js";

export const getSearchItems = ({ limit, where, order }: SearchItemParams) => {
    return Item.findAll({
        attributes: ["id", "name", "price", "status", "gender_type", "age_type", "first_image_url", "attributes", "sort_number", "uploaded_at"],
        where,
        limit,
        order,
        include: [
            {
                model: Video,
                attributes: ["title", "thumbnail_url", "duration"],
            },
            {
                model: Sale,
                attributes: ["discount_rate", "discount_amount", "sale_flag", "before_price"],
            },
            {
                model: User,
                attributes: ["id", "user_name", "profile_image"],
            },
        ],
    });
};
