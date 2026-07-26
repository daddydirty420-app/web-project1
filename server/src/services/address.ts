import { Address, TodouhukenOption } from "../models/index.js";
import {
    AddressIdParams,
    AddressTransactionParams,
    CreateAddressFirstParams,
    CreateAddressShopEditAllowNullParams,
    CreateAddressShopEditParams,
    CreateAddressShopParams,
    CreateAddressParams,
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

export const createAddressFirst = async ({ transaction }: CreateAddressFirstParams) => {
    await Address.create({ transaction });
};

export const createAddress = async ({ data, transaction }: CreateAddressParams) => {
    return Address.create(data, { transaction });
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
