import { Op, Transaction } from 'sequelize';
import { Delivery, Item, Orders, User } from '../models/index.js';

type ItemIdParams = {
    itemId: number;
};

type CreateParams = {
    itemId: number;
    user: InstanceType<typeof User>;
    item: InstanceType<typeof Item>;
    transaction: Transaction;
};

export const findDeliveryNow = async ({ itemId }: ItemIdParams) => {
    return Delivery.findAll({
        where: {
            cancel: false,
            delivery_status_id: { [Op.ne]: 4 },
            orders_id: { [Op.not]: null },
        },
        include: [
            {
                model: Orders,
                required: true,
                where: { item_id: itemId },
            },
        ],
    });
};

export const createDelivery = async ({ itemId, user, item, transaction }: CreateParams) => {
    return Delivery.create(
        {
            buyer_phone_number: user.phone_number ?? '',
            shipping_day_id: item.ItemShippingProfile.shipping_day_id,
            shipping_service_id: item.ItemShippingProfile.shipping_service_id,
            delivery_status_id: 1,
            shipping_place_id: item.ItemShippingProfile.shipping_place_id,
            item_id: itemId,
            shipping_from_name: `${item.User.Name?.sei ?? ''} ${item.User.Name?.mei ?? ''}`,
            shipping_from_postcode: item.User.Address?.post_number ?? '',
            shipping_from_prefecture: item.User.Address?.AddressTodouhuken?.name ?? '',
            shipping_from_address_line1: `${item.User.Address?.shikutyouson ?? ''} ${item.User.Address?.banchi ?? ''}`,
            shipping_from_address_line2: item.User.Address?.building ?? '',
            shipping_from_phone: item.User.phone_number ?? '',
        },
        { transaction },
    );
};
