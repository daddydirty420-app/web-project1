import { TokenPasswordReset } from "../../models/index.js";

export type TokenParams = {
    token: string;
};

export type CreateTokenParams = {
    data: {
        token_hash: string;
        expires_at: Date;
        user_id: number;
    };
};

export type DeleteTokenParams = {
    resetRecord: InstanceType<typeof TokenPasswordReset>;
};
