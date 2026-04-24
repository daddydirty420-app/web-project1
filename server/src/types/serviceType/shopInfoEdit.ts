import { Transaction } from "sequelize";
import { ShopInfoEdit } from "../../models/index.js";

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

export type CreateShopEditCompanyNameParams = {
    data: {
        user_id: number;
        shop_info_id: number;
        company_name: string;
    };
    transaction?: Transaction;
};

export type CreateShopEditComFreeParams = {
    data: {
        company_name: string | null;
        phone_number: string | null;
        email: string | null;
        open_date_time: string | null;
        founded_date: Date | null;
        member_count: number | null;
        homepage_url: string | null;
        company_number: string | null;
        capital: number | null;
        user_id: number;
        shop_info_id: number;
        com_or_free_id: number;
    };
    transaction?: Transaction;
};

export type UpdateShopEditAnyParams = {
    shopEdit: InstanceType<typeof ShopInfoEdit>;
    data: any;
    transaction?: Transaction;
};
