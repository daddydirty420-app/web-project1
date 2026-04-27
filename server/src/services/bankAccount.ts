import { AccountTypeOption, BankAccount } from "../models/index.js";
import {
    AccountIdParams,
    CreateBankParams,
    CreateBankShopEditAllowNullParams,
    CreateBankShopEditParams,
    ShopIdParams,
    updateBankParams,
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
            "account_type_id",
            "account_number",
            "meigi",
            "bank_code",
            "branch_code",
        ],
        where: { user_id: userId },
        include: [{ model: AccountTypeOption }],
    });
};

export const getShopAccountOne = ({ shopId }: ShopIdParams) => {
    return BankAccount.findOne({
        attributes: [
            "id",
            "bank_name",
            "branch",
            "account_type_id",
            "account_number",
            "meigi",
            "bank_code",
            "branch_code",
        ],
        where: { shop_info_id: shopId },
        include: [{ model: AccountTypeOption }],
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

export const updateBankAccount = async ({ account, data }: updateBankParams) => {
    await account.update(data);
};
