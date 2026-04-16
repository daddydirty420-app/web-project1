import { RefreshTokens } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

type CreateRefreshTokenParams = {
    data: {
        token: string;
        user_id: number;
        expires_at: Date;
    };
};

export const createRefreshToken = async ({ data }: CreateRefreshTokenParams) => {
    await RefreshTokens.create(data);
};

export const destroyRefreshToken = async ({ userId }: UserIdParams) => {
    await RefreshTokens.destroy({
        where: { user_id: userId },
    });
};