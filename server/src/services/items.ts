import { Address, Item, ItemShippingProfile, Name, TodouhukenOption, User, Video } from "../models/index.js";
import { ItemIdParams } from "../types/serviceType/items.js";

type UpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
    };
};

export const findByPkItem = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId);
};

export const findByPkItemBuy = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        include: [
            { model: ItemShippingProfile },
            {
                model: User,
                include: [
                    {
                        model: Address,
                        required: false,
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: Name,
                        required: false,
                    },
                ],
            },
        ],
    });
};

export const getMetadata = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: ["name", "price", "first_image_url"],
        include: [
            {
                model: Video,
                attributes: ["title", "summary"],
            },
        ],
    });
};

export const updateSortNumber = async ({ item, data }: UpdateParams) => {
    await item.update(data);
};