import { BankAccount } from '../models/index.js';
import { Transaction } from 'sequelize';

type CreateBankParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
};

export const createBank = async ({ data, transaction }: CreateBankParams) => {
    await BankAccount.create(data, { transaction });
};
