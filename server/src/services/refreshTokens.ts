import { Transaction } from 'sequelize';
import { RefreshTokens } from '../models/index.js';

type UserIdParams = {
    userId: number;
};

type CreateRefreshTokenParams = {
    data: {
        token: string;
        user_id: number;
        expires_at: Date;
    };
    transaction?: Transaction;
};

export const createRefreshToken = async ({ data, transaction }: CreateRefreshTokenParams) => {
    await RefreshTokens.create(data, { transaction });
};

export const destroyRefreshToken = async ({ userId }: UserIdParams) => {
    await RefreshTokens.destroy({
        where: { user_id: userId },
    });
};
