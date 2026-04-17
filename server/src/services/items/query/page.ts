// 商品ページ表示用
import {
    Brands,
    Categories,
    Item,
    ItemConditionOption,
    ItemShippingProfile,
    Sale,
    ShippingDayOption,
    ShippingServiceOption,
    ShopInfo,
    TodouhukenOption,
    User,
    Video,
} from "../../../models/index.js";
import { ItemIdParams } from "../../../types/serviceType/items/items.js";

export const getItemPageData = ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: {
            exclude: ["sort_number", "views_count", "checked", "createdAt", "search_text"],
        },
        include: [
            { model: ItemConditionOption },
            {
                model: User,
                attributes: [
                    "id",
                    "user_name",
                    "profile_image",
                    "early_seller",
                    "honnin_verified",
                    "star_amount",
                    "star_average",
                ],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                    },
                ],
            },
            {
                model: Video,
                attributes: [
                    "id",
                    "thumbnail_url",
                    "title",
                    "summary",
                    "duration",
                    "play_count",
                    "original_url",
                    "converted_url",
                ],
            },
            {
                model: Sale,
                attributes: ["id", "before_price", "discount_rate", "discount_amount", "sale_flag"],
            },
            {
                model: ItemShippingProfile,
                include: [{ model: ShippingDayOption }, { model: ShippingServiceOption }, { model: TodouhukenOption }],
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
};
