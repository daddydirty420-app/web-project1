import { Transaction } from "sequelize";

export type UserIdParams = {
    userId: number;
};

export type CreateOutputParams = {
    data: {
        output: string;
        output_user_id: number;
    };
};

export type CreateInputParams = {
    data: {
        input: string;
        input_user_id: number;
    };
};

export type DeleteReferenceCodeUserIdTransactionParams = {
    userId: number;
    transaction?: Transaction;
};
