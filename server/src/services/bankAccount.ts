import { Transaction } from "sequelize";
import { AccountTypeOption, BankAccount } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

type CreateBankParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
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

export const createBank = async ({ data, transaction }: CreateBankParams) => {
    await BankAccount.create(data, { transaction });
};
