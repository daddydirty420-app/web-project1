// 複数関連モデル取得
import { Categories, Item, ItemShippingProfile, Sale, User, Video } from "../../../models/index.js";
import { ItemIdParams } from "../../../types/serviceType/items/items.js";

export const getItem = ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId);
};

export const getItemHighlight = ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: ['id', 'name', 'price', "attributes", 'first_image_url', "gender_type", "age_type", "seller_id", "status"],
    });
};

export const getItemWithVideoSaleShipping = ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        include: [
            { model: Video },
            { model: Sale },
            { model: ItemShippingProfile },
        ],
    });
};

export const getItemWithVideoCategoriesUser = ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        include: [
            { model: Video },
            {
                model: Categories,
                as: "Category",
                include: [
                    {
                        model: Categories,
                        as: "parent",
                        required: false,
                    },
                ],
            },
            { model: User },
        ],
    });
};