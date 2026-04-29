import { Transaction } from "sequelize";
import { User } from "../../models/index.js";

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

export type UpdateEmailParams = {
    user: InstanceType<typeof User>;
    data: {
        email: string;
    };
    transaction?: Transaction;
};

export type UpdatePhoneNumberParams = {
    user: InstanceType<typeof User>;
    data: {
        phone_number: string;
    };
    transaction?: Transaction;
};

export type UpdateProfileParams = {
    user: InstanceType<typeof User>;
    data: {
        user_name: string;
        user_introduction: string | null;
        profile_image?: string;
    };
    transaction?: Transaction;
};

export type UpdateHonninParams = {
    user: InstanceType<typeof User>;
    data: {
        honnin_verify_request: boolean;
        honnin_verified: boolean;
        birthday: Date;
        phone_number: string;
        gender_id: number;
    };
    transaction?: Transaction;
};

export type UpdateUserPointsUriageParams = {
    user: InstanceType<typeof User>;
    data: {
        points: number;
        uriagekin: number;
    };
    transaction?: Transaction;
};

export type UpdateUserUriageParams = {
    user: InstanceType<typeof User>;
    data: {
        uriagekin: number;
    };
    transaction?: Transaction;
};
