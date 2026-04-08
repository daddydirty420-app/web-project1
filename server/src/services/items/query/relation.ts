// 複数関連モデル取得
import { Categories, Item, ItemShippingProfile, Sale, User, Video } from "../../../models/index.js";
import { ItemIdParams } from "../../../types/serviceType/items/items.js";

export const getItem = ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId);
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