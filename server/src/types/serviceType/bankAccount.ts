import { Transaction } from "sequelize";
import { BankAccount } from "../../models/index.js";

export type AccountIdParams = {
    accountId: number;
};

export type UserIdParams = {
    userId: number;
};

export type ShopIdParams = {
    shopId: number;
};

export type ShopEditIdParams = {
    shopEditId: number;
};

export type CreateBankParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
};

export type CreateBankShopEditParams = {
    data: {
        bank_code: string;
        bank_name: string;
        branch_code: string;
        branch: string;
        account_type_id: number;
        account_number: string;
        meigi: string;
        shop_info_edit_id: number;
    };
    transaction?: Transaction;
};

export type CreateBankShopEditAllowNullParams = {
    data: {
        bank_code: string | null;
        bank_name: string | null;
        branch_code: string | null;
        branch: string | null;
        account_type_id: number | null;
        account_number: string | null;
        meigi: string | null;
        shop_info_edit_id: number;
    };
    transaction?: Transaction;
};

export type updateBankParams = {
    account: InstanceType<typeof BankAccount>;
    data: {
        bank_code: string;
        bank_name: string;
        branch_code: string;
        branch: string;
        account_type_id: number;
        account_number: string;
        meigi: string;
    };
};

export type UpsertBankShopParams = {
    data: {
        bank_code: string;
        bank_name: string;
        branch_code: string;
        branch: string;
        account_type_id: number;
        account_number: string;
        meigi: string;
        shop_info_id: number;
    };
    transaction?: Transaction;
};
