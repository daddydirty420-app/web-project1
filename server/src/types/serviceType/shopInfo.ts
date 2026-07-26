import { Transaction } from "sequelize";
import { ShopInfo } from "../../models/index.js";

export type ShopIdParams = {
    shopId: number;
};

export type UserIdParams = {
    userId: number;
};

export type UserShopIdParams = {
    userId: number;
    shopId: number;
};

export type CreateShopParams = {
    data: {
        company_name: string;
        shop_name: string;
        phone_number: string;
        email: string;
        homepage_url: string | null;
        open_date_time: string;
        company_number: string | null;
        capital: number;
        member_count: number;
        user_id: number;
        address_id: number;
        com_or_free_id: number;
        founded_date: Date;
        name_representative_id: number;
        name_contact_id: number;
    };
    transaction?: Transaction;
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

export type UpdateShopIdPermitParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        id_card_front: string | null;
        id_card_rear: string | null;
        permit_url: string[];
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

export type UpdateOptionParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        auto_trans: boolean;
        open_info: boolean;
    };
    transaction?: Transaction;
};

export type UpdateShopRequestAllParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        request_all: boolean;
    };
    transaction?: Transaction;
};

export type UpdateBankAccountParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        account_id: number;
    };
    transaction?: Transaction;
};

export type UpdateShopUserLogicalDeleteParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        user_id: null;
    };
    transaction?: Transaction;
};

export type UpdateShopAnyParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: any;
    transaction?: Transaction;
};

export type ShopTransactionParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    transaction?: Transaction;
};
