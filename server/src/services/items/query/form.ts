// 出品フォーム用
import {
    Brands,
    Categories,
    Item,
    ItemConditionOption,
    ItemShippingProfile,
    Sale,
    ShippingDayOption,
    ShippingServiceOption,
    TodouhukenOption,
    Video,
} from "../../../models/index.js";
import { ItemIdParams } from "../../../types/serviceType/items.js";

export const getItemFormData = ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: [
            "id",
            "name",
            "detail",
            "image_url",
            "price",
            "seller_id",
            "gender_type",
            "age_type",
            "status",
            "attributes",
        ],
        include: [
            {
                model: Video,
                attributes: ["id", "thumbnail_url", "title", "summary", "duration", "original_url", "converted_url"],
            },
            {
                model: Sale,
                attributes: ["id", "before_price"],
            },
            {
                model: ItemShippingProfile,
                attributes: ["id", "shipping_service_free_text"],
                include: [
                    { model: ShippingDayOption, required: false },
                    { model: ShippingServiceOption, required: false },
                    { model: TodouhukenOption, required: false },
                ],
            },
            {
                model: ItemConditionOption,
                required: false,
            },
            {
                model: Brands,
                as: "Brand",
                attributes: ["id", "name"],
                required: false,
            },
            {
                model: Categories,
                as: "Category",
                attributes: ["id", "name", "level", "parent_id"],
                required: false,
            },
        ],
    });
};
