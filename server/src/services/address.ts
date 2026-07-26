import { Address, TodouhukenOption } from "../models/index.js";
import {
    AddressIdParams,
    AddressTransactionParams,
    CreateAddressParams,
    CreateAddressShopEditAllowNullParams,
    CreateAddressShopEditParams,
    CreateAddressShopParams,
    CreateDeliveryAddressParams,
    UpdateAddressParams,
    UpdateAddressUserLogicalDeleteParams,
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

export const createAddress = async ({ data, transaction }: CreateAddressParams) => {
    await Address.create(data, { transaction });
};

export const createDeliveryAddress = async ({ data, transaction }: CreateDeliveryAddressParams) => {
    await Address.create(data, { transaction });
};

export const createAddressShop = async ({ data, transaction }: CreateAddressShopParams) => {
    await Address.create(data, { transaction });
};

export const createAddressShopEdit = async ({ data, transaction }: CreateAddressShopEditParams) => {
    await Address.create(data, { transaction });
};

export const createAddressShopEditAllowNull = async ({ data, transaction }: CreateAddressShopEditAllowNullParams) => {
    await Address.create(data, { transaction });
};

export const updateAddress = async ({ address, data, transaction }: UpdateAddressParams) => {
    await address.update(data, { transaction });
};

export const updateAddressUserLogicalDelete = async ({
    address,
    data,
    transaction,
}: UpdateAddressUserLogicalDeleteParams) => {
    await address.update(data, { transaction });
};

export const deleteAddress = async ({ address, transaction }: AddressTransactionParams) => {
    await address.destroy({ transaction });
};
