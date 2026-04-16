import { Transaction } from "sequelize";

export type UserIdParams = {
    userId: number;
};

export type EmailParams = {
    email: string;
};

export type CreateUserParams = {
    data: {
        email: string;
        password: string;
        user_name: string;
    };
    transaction?: Transaction;
};