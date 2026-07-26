import { BankAccount } from "../models/index.js";
import {
    AccountIdParams,
    BankTransactionParams,
    TransactionParams,
    CreateBankShopEditAllowNullParams,
    CreateBankShopEditParams,
    updateBankParams,
    UpsertBankShopParams,
} from "../types/serviceType/bankAccount.js";

export const getBankAccount = ({ accountId }: AccountIdParams) => {
    return BankAccount.findByPk(accountId);
};

export const createBankAccountFirst = async ({ transaction }: TransactionParams) => {
    await BankAccount.create({ transaction });
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
