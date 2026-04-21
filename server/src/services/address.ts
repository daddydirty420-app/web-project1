import { Address, TodouhukenOption } from "../models/index.js";
import {
    AddressIdParams,
    CreateAddressParams,
    CreateAddressShopEditParams,
    CreateDeliveryAddressParams,
    DeliveryIdParams,
    UpdateAddressParams,
    UserIdParams,
} from "../types/serviceType/address.js";

export const getAddress = ({ addressId }: AddressIdParams) => {
    return Address.findByPk(addressId, {
        include: [
            {
                model: TodouhukenOption,
                as: "AddressTodouhuken",
            },
        ],
    });
};

export const getAddressOne = ({ userId }: UserIdParams) => {
    return Address.findOne({
        where: { user_id: userId },
        include: [
            {
                model: TodouhukenOption,
                as: "AddressTodouhuken",
            },
        ],
    });
};

export const getMyAddressOne = ({ userId }: UserIdParams) => {
    return Address.findOne({
        attributes: ["id", "post_number", "todouhuken_id", "shikutyouson", "banchi", "building"],
        where: { user_id: userId },
        include: [
            {
                model: TodouhukenOption,
                as: "AddressTodouhuken",
            },
        ],
    });
};

export const getDeliveryAddressOne = ({ deliveryId }: DeliveryIdParams) => {
    return Address.findOne({
        attributes: ["id", "post_number", "shikutyouson", "banchi", "building", "delivery_id", "user_id"],
        where: { delivery_id: deliveryId },
        include: [
            {
                model: TodouhukenOption,
                as: "AddressTodouhuken",
            },
        ],
    });
};

export const createAddress = async ({ data, transaction }: CreateAddressParams) => {
    await Address.create(data, { transaction });
};

export const createDeliveryAddress = async ({ data, transaction }: CreateDeliveryAddressParams) => {
    await Address.create(data, { transaction });
};

export const createAddressShopEdit = async ({ data, transaction }: CreateAddressShopEditParams) => {
    await Address.create(data, { transaction });
};

export const updateAddress = async ({ address, data, transaction }: UpdateAddressParams) => {
    await address.update(data, { transaction });
};
