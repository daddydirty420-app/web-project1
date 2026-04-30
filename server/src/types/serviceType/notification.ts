import { Transaction } from "sequelize";

export type UserIdParams = {
    userId: number;
};

export type CreateNotificationParams = {
    data: {
        read_user_id: number;
        url?: string | null;
        message_image?: string | null;
        message: string;
    };
    transaction?: Transaction;
};

export type DeleteNotificationUserIdTransactionParams = {
    userId: number;
    transaction?: Transaction;
};
