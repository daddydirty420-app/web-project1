import { Address } from '../models/index.js';
import { CreateAddressParams, CreateDeliveryAddressParams, UserIdParams } from '../types/serviceType/address.js';

export const getAddressOne = ({ userId }: UserIdParams) => {
    return Address.findOne({
        where: { user_id: userId },
    });
};

export const createAddress = async ({ data, transaction }: CreateAddressParams) => {
    await Address.create(data, { transaction });
};

export const createDeliveryAddress = async ({ deliveryId, userAddress, transaction }: CreateDeliveryAddressParams) => {
    return Address.create(
        {
            delivery_id: deliveryId,
            post_number: userAddress?.post_number ?? null,
            todouhuken_id: userAddress?.todouhuken_id ?? null,
            shikutyouson: userAddress?.shikutyouson ?? null,
            banchi: userAddress?.banchi ?? null,
            building: userAddress?.building ?? null,
        },
        { transaction },
    );
};
