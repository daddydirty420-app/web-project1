// 複数関連モデル取得
import { Categories, Item, ItemShippingProfile, Sale, User, Video } from "../../../models/index.js";
import { ItemIdParams } from "../../../types/serviceType/items.js";

export const getItem = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId);
};

export const getItemWithVideoSaleShipping = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        include: [
            { model: Video },
            { model: Sale },
            { model: ItemShippingProfile },
        ],
    });
};

export const getItemWithVideoCategoriesUser = async ({ itemId }: ItemIdParams) => {
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