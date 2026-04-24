import { Transaction } from "sequelize";
import { ShopInfo } from "../../models/index.js";

export type ShopIdParams = {
    shopId: number;
};

export type UpdateShopEmailParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        email: string;
    };
    transaction?: Transaction;
};

export type UpdateShopIdCardParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        id_card_front: string | null;
        id_card_rear: string | null;
    };
    transaction?: Transaction;
};

export type UpdateShopPhoneNumberParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        phone_number: string;
    };
    transaction?: Transaction;
};

export type UpdateShopNameParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        shop_name: string;
    };
    transaction?: Transaction;
};

export type UpdateCompanyNameParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        company_name: string;
    };
    transaction?: Transaction;
};
