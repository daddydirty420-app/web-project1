import { TokenPasswordReset } from "../models/index.js";
import { CreateTokenParams, DeleteTokenParams, TokenParams } from "../types/serviceType/tokenPasswordReset.js";

export const getTokenOne = ({ token }: TokenParams) => {
    return TokenPasswordReset.findOne({
        where: { token_hash: token },
    });
};

export const createTokenResetPW = async ({ data }: CreateTokenParams) => {
    await TokenPasswordReset.create(data);
};

export const deleteTokenRecord = async ({ resetRecord }: DeleteTokenParams) => {
    await resetRecord.destroy();
};
