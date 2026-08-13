import type { Transaction } from "sequelize";

export type UserIdParams = {
    userId: number;
};

export type CreateSearchKeywordParams = {
    data: {
        search_text: string;
        user_id: number | null;
    };
    transaction?: Transaction;
};

export type CronDeleteSearchParams = {
    createdBefore: Date;
};
