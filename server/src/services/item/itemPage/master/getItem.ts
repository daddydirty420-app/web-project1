import { AppError } from "../../../../errors.js";
import { Brands, Categories, Item, ItemConditionOption, ItemShippingProfile, Sale, ShippingDayOption, ShippingServiceOption, ShopInfo, TodouhukenOption, User, Video } from "../../../../models/index.js";
import { ItemPageMode } from "../itemPage.service.js";

type Params = {
    itemId: number;
    mode: ItemPageMode;
};

export const getItem = async ({ itemId, mode }: Params) => {

    const item = await Item.findByPk(itemId, {
        attributes: {
            exclude: ['sort_number', 'views_count', 'checked', 'createdAt', 'search_text'],
        },
        include: [
            { model: ItemConditionOption },
            {
                model: User,
                attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                    },
                ],
            },
            {
                model: Video,
                attributes: ['id', 'thumbnail_url', 'title', 'summary', 'duration', 'play_count', 'original_url', 'converted_url'],
            },
            {
                model: Sale,
                attributes: ['id', 'before_price', 'discount_rate', 'discount_amount', 'sale_flag'],
            },
            {
                model: ItemShippingProfile,
                include: [
                    { model: ShippingDayOption },
                    { model: ShippingServiceOption },
                    { model: TodouhukenOption },
                ],
            },
            {
                model: Categories,
                as: "Category",
                include: [
                    {
                        model: Categories,
                        attributes: ["id", "name", "level", "parent_id", "allowed_gender", "allowed_age"],
                        as: "children",
                        required: false,
                    },
                    {
                        model: Categories,
                        attributes: ["id", "name", "level", "allowed_gender", "allowed_age"],
                        as: "parent",
                        required: false,
                    },
                ],
            },
            {
                model: Brands,
                as: "Brand",
                required: false,
            },
        ],
    });

    if (!item
        || mode === "normal" && !(["active", "soldout"].includes(item.status))
        || (mode === "draft" && !(item.status === "draft"))
        || (mode === "confirm" && item.status === "deleted")
        || (mode === "deleted" && !(item.status === "deleted"))
    ) {
        throw new AppError("ITEM_NOTFOUND", 404);
    }

    return item;
};