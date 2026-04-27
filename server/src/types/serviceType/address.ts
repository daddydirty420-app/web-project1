import { Transaction } from "sequelize";
import { Address } from "../../models/index.js";

export type AddressIdParams = {
    addressId: number;
};

export type UserIdParams = {
    userId: number;
};

export type DeliveryIdParams = {
    deliveryId: number;
};

export type ShopIdParams = {
    shopId: number;
};

export type ShopEditIdParams = {
    shopEditId: number;
};

export type CreateAddressParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
};

export type CreateDeliveryAddressParams = {
    data: {
        delivery_id: number;
        post_number: string;
        todouhuken_id: number;
        shikutyouson: string;
        banchi: string;
        building?: string;
    };
    transaction?: Transaction;
};

export type CreateAddressShopParams = {
    data: {
        post_number: string;
        todouhuken_id: number;
        shikutyouson: string;
        banchi: string;
        building?: string;
        shop_info_id: number;
    };
    transaction?: Transaction;
};

export type CreateAddressShopEditParams = {
    data: {
        post_number: string;
        todouhuken_id: number;
        shikutyouson: string;
        banchi: string;
        building?: string;
        shop_info_edit_id: number;
    };
    transaction?: Transaction;
};

export type CreateAddressShopEditAllowNullParams = {
    data: {
        post_number: string | null;
        todouhuken_id: number | null;
        shikutyouson: string | null;
        banchi: string | null;
        building?: string | null;
        shop_info_edit_id: number;
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
