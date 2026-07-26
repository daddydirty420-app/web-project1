import { BankAccount } from "../models/index.js";
import {
    AccountIdParams,
    BankTransactionParams,
    CreateBankAllowNullParams,
    CreateBankParams,
    TransactionParams,
    updateBankParams,
} from "../types/serviceType/bankAccount.js";

export const getBankAccount = ({ accountId }: AccountIdParams) => {
    return BankAccount.findByPk(accountId);
};

export const createBankAccountFirst = async ({ transaction }: TransactionParams) => {
    await BankAccount.create({ transaction });
};

export const createBankAccount = async ({ data, transaction }: CreateBankParams) => {
    return BankAccount.create(data, { transaction });
};

export const createBankAccountAllowNull = async ({ data, transaction }: CreateBankAllowNullParams) => {
    return BankAccount.create(data, { transaction });
};

export const updateBankAccount = async ({ account, data, transaction }: updateBankParams) => {
    await account.update(data, { transaction });
};

export const deleteBankAccount = async ({ account, transaction }: BankTransactionParams) => {
    await account.destroy({ transaction });
};
