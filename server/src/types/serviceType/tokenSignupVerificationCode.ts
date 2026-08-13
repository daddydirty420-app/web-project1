import type { Transaction } from "sequelize";
import { TokenSignupVerification } from "../../models/index.js";

export type VerificationCodeParams = {
    verificationCode: string;
};

export type TokenParams = {
    token: string;
};

export type CreateTokenParams = {
    data: {
        user_id: number;
        verification_code: string;
        verification_code_expires: Date;
        reissue_token: string;
        reissue_token_expires: Date;
    };
    transaction?: Transaction;
};

export type ReissueUpdateParams = {
    tokenRecord: InstanceType<typeof TokenSignupVerification>;
    data: {
        verification_code: string;
        verification_code_expires: Date;
        reissue_token: string;
        reissue_token_expires: Date;
    };
};

export type DestroyTokenParams = {
    tokenRecord: InstanceType<typeof TokenSignupVerification>;
};

export type GetExpiredSignupVerificationTokensParams = {
    expiredBefore: number;
};

export type DestroySignupVerificationTokensParams = {
    userIds: number[];
    transaction: Transaction;
};
