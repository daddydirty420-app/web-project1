import { Brands, Categories, ItemConditionOption, ItemShippingProfile, Sale, ShippingDayOption, ShippingServiceOption, TodouhukenOption, Video } from "../../../models/index.js";

export const ItemDetailInclude = [
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
];

export const normalInclude = [
    {
        model: Video,
        attributes: ["id"],
    },
    {
        model: Sale,
        attributes: ["id"],
    },
    {
        model: ItemShippingProfile,
        attributes: ["id"],
    },
];