// 購入データ作成用データ取得
import { Address, Item, ItemShippingProfile, Name, TodouhukenOption, User } from '../../../models/index.js';
import { ItemIdParams } from '../../../types/serviceType/items/items.js';

export const getItemForBuy = ({ itemId }: ItemIdParams) => {
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
                                as: 'AddressTodouhuken',
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
