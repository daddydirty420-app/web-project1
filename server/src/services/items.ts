import { Address, Item, ItemShippingProfile, Name, TodouhukenOption, User } from "../models/index.js";
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

export const updateSortNumber = async ({ item, data }: UpdateParams) => {
    await item.update(data);
};