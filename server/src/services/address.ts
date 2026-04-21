import { Address, TodouhukenOption } from "../models/index.js";
import {
    AddressIdParams,
    CreateAddressParams,
    CreateDeliveryAddressParams,
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

export const createAddress = async ({ data, transaction }: CreateAddressParams) => {
    await Address.create(data, { transaction });
};

export const createDeliveryAddress = async ({ data, transaction }: CreateDeliveryAddressParams) => {
    await Address.create(data, { transaction });
};

export const updateAddress = async ({ address, data, transaction }: UpdateAddressParams) => {
    await address.update(data, { transaction });
};
