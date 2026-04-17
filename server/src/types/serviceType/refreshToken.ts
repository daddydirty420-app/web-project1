import { Transaction } from "sequelize";
import { RefreshTokens } from "../../models/index.js";

export type RefreshTokenParams = {
    refreshToken: string;
};

export type UserIdParams = {
    userId: number;
};

export type CreateRefreshTokenParams = {
    data: {
        token: string;
        user_id: number;
        expires_at: Date;
    };
    transaction?: Transaction;
};

export type StoredTokenParams = {
    storedToken: InstanceType<typeof RefreshTokens>;
};
