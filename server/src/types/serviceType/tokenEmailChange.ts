export type TokenEmailChangeParams = {
    token: string;
};

export type CreateTokenEmailChangeParams = {
    data: {
        token_hash: string;
        expires_at: Date;
        user_id: number;
        new_email: string;
    };
};

export type DestroyExpiredEmailChangeTokensParams = {
    expiredBefore: number;
};
