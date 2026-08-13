import { Transaction } from "sequelize";
import { WatchHistory } from "../../models/index.js";

export type ItemUserParams = {
    itemId: number;
    userId: number;
};

export type WatchHistoryParams = {
    history: InstanceType<typeof WatchHistory>;
};

export type UserWatchListParams = {
    userId: number;
    itemWhere: any;
    limit: number;
    offset: number;
};

export type DeleteWatchHistoryUserIdTransactionParams = {
    userId: number;
    transaction?: Transaction;
};

export type CronDeleteWatchHistoryParams = {
    updatedBefore: Date;
};
