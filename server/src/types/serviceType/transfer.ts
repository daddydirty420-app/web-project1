import { Transaction } from "sequelize";

export type UserIdParams = {
    userId: number;
};

export type TransferIdParams = {
    id: string;
};

export type CreateTransferParams = {
    data: {
        all_money: number;
        handling_charge: number;
        trans_money: number;
        trans_reason_id: number;
        user_id: number;
        trans_schedule_date: Date;
        transfer_id: string;
    };
    transaction?: Transaction;
};

export type DeleteTransferUserIdTransactionParams = {
    userId: number;
    transaction?: Transaction;
};
