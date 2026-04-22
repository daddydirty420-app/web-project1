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
        user_id?: number;
        bank_code?: string;
        bank_name?: string;
        branch_code?: string;
        branch?: string;
        account_type_id?: number;
        account_number?: string;
        meigi?: string;
        shop_info_edit_id?: number;
    };
    transaction?: Transaction;
};

export type updateBankParams = {
    account: InstanceType<typeof BankAccount>;
    data: {
        bank_code?: string;
        bank_name?: string;
        branch_code?: string;
        branch?: string;
        account_type_id?: number;
        account_number?: string;
        meigi?: string;
    };
};
