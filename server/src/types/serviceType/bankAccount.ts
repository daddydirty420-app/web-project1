import { Transaction } from "sequelize";
import { BankAccount } from "../../models/index.js";
import { AccountType } from "../bankSnapshot.js";

export type AccountIdParams = {
    accountId: number;
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
        account_type: AccountType;
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
        account_type: AccountType;
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
        account_type: AccountType;
        account_number: string;
        meigi: string;
    };
    transaction?: Transaction;
};

export type UpsertBankShopParams = {
    data: {
        bank_code: string;
        bank_name: string;
        branch_code: string;
        branch: string;
        account_type: AccountType;
        account_number: string;
        meigi: string;
        shop_info_id: number;
    };
    transaction?: Transaction;
};

export type BankTransactionParams = {
    account: InstanceType<typeof BankAccount>;
    transaction?: Transaction;
};
