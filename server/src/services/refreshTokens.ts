import { RefreshTokens } from "../models/index.js";
import {
    CreateRefreshTokenParams,
    RefreshTokenParams,
    StoredTokenParams,
    UserIdParams,
} from "../types/serviceType/refreshToken.js";

export const getRefreshTokenOne = ({ refreshToken }: RefreshTokenParams) => {
    return RefreshTokens.findOne({
        where: { token: refreshToken },
    });
};

export const createRefreshToken = async ({ data, transaction }: CreateRefreshTokenParams) => {
    await RefreshTokens.create(data, { transaction });
};

export const destroyRefreshToken = async ({ userId }: UserIdParams) => {
    await RefreshTokens.destroy({
        where: { user_id: userId },
    });
};

export const destroyStoredRefreshToken = async ({ storedToken }: StoredTokenParams) => {
    await storedToken.destroy();
};
