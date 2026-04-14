import { Transaction } from "sequelize";

export type UserIdParams = {
    userId: number;
};

export type CreateNormalTransactionParams = {
    data: {
        read_user_id: number;
        url: string;
        message_image: string;
        message: string;
    };
    transaction?: Transaction;
};