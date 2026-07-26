import { Transaction } from "sequelize";
import { Address } from "../../models/index.js";

export type AddressIdParams = {
    addressId: number;
};

export type ShopIdParams = {
    shopId: number;
};

export type ShopEditIdParams = {
    shopEditId: number;
};

export type CreateAddressFirstParams = {
    transaction?: Transaction;
};

export type CreateAddressParams = {
    data: {
        post_number: string;
        todouhuken_id: number;
        shikutyouson: string;
        banchi: string;
        building?: string;
    };
    transaction?: Transaction;
};

export type UpdateAddressParams = {
    address: InstanceType<typeof Address>;
    data: {
        post_number: string;
        todouhuken_id: number;
        shikutyouson: string;
        banchi: string;
        building?: string;
    };
    transaction?: Transaction;
};

export type UpdateAddressUserLogicalDeleteParams = {
    address: InstanceType<typeof Address>;
    data: {
        user_id: null;
    };
    transaction?: Transaction;
};

export type AddressTransactionParams = {
    address: InstanceType<typeof Address>;
    transaction?: Transaction;
};
