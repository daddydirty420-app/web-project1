import { TokenEmailChange } from "../models/index.js";

type TokenCreateParams = {
    data: {
        token_hash: string;
        expires_at: Date;
        user_id: number;
        new_email: string;
    };
};

export const createTokenEmailChange = async ({ data }: TokenCreateParams) => {
    await TokenEmailChange.create(data);
};