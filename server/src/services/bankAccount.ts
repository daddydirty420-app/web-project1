import { BankAccount } from "../models/index.js";
import {
    AccountIdParams,
    BankTransactionParams,
    CreateBankParams,
    CreateBankShopEditAllowNullParams,
    CreateBankShopEditParams,
    ShopIdParams,
    updateBankParams,
    UpsertBankShopParams,
    UserIdParams,
} from "../types/serviceType/bankAccount.js";

export const getBankAccount = ({ accountId }: AccountIdParams) => {
    return BankAccount.findByPk(accountId);
};

export const getMyAccountOne = ({ userId }: UserIdParams) => {
    return BankAccount.findOne({
        attributes: [
            "id",
            "bank_name",
            "branch",
            "account_type",
            "account_number",
            "meigi",
            "bank_code",
            "branch_code",
        ],
        where: { user_id: userId },
    });
};

export const getShopAccountOne = ({ shopId }: ShopIdParams) => {
    return BankAccount.findOne({
        attributes: [
            "id",
            "bank_name",
            "branch",
            "account_type",
            "account_number",
            "meigi",
            "bank_code",
            "branch_code",
        ],
        where: { shop_info_id: shopId },
    });
};

export const createBankAccount = async ({ data, transaction }: CreateBankParams) => {
    await BankAccount.create(data, { transaction });
};

export const createBankAccountShopEdit = async ({ data, transaction }: CreateBankShopEditParams) => {
    await BankAccount.create(data, { transaction });
};

export const createBankAccountShopEditAllowNull = async ({ data, transaction }: CreateBankShopEditAllowNullParams) => {
    await BankAccount.create(data, { transaction });
};

export const updateBankAccount = async ({ account, data, transaction }: updateBankParams) => {
    await account.update(data, { transaction });
};

export const upsertBankAccountShop = async ({ data, transaction }: UpsertBankShopParams) => {
    await BankAccount.upsert(data, { transaction });
};

export const deleteBankAccount = async ({ account, transaction }: BankTransactionParams) => {
    await account.destroy({ transaction });
};
