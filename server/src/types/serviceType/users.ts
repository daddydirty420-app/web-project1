import { User } from "../../models/index.js";
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

export type EmailVerifyParams = {
    user: InstanceType<typeof User>;
    data: {
        email_verified: boolean;
    };
    transaction?: Transaction;
};

export type UpdatePasswordParams = {
    user: InstanceType<typeof User>;
    data: {
        password: string;
    };
    transaction?: Transaction;
};
