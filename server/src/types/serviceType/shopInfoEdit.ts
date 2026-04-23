import { Transaction } from "sequelize";

export type ShopEditIdParams = {
    shopEditId: number;
};

export type CreateShopEditParams = {
    data: {
        user_id: number;
        shop_info_id: number;
    };
    transaction?: Transaction;
};

export type CreateShopEditWithIdCardParams = {
    data: {
        user_id: number;
        shop_info_id: number;
        id_card_front: string | null;
        id_card_rear: string | null;
    };
    transaction?: Transaction;
};