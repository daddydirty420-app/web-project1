import { TokenPasswordReset } from '../models/index.js';

type CreateTokenParams = {
    data: {
        token_hash: string;
        expires_at: Date;
        user_id: number;
    };
};

export const createTokenResetPW = async ({ data }: CreateTokenParams) => {
    await TokenPasswordReset.create(data);
};
