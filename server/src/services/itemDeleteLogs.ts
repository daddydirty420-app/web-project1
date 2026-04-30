import { Transaction } from "sequelize";
import { ItemDeleteLogs } from "../models/index.js";

type PerfectDeleteParams = {
    itemId: number;
    userId: number;
    transaction?: Transaction;
};

type BulkCreateDeleteLogParams = {
    data: {
        item_id: number;
        delete_user_id: number;
        delete_by_admin: boolean;
        delete_reason: string;
    }[];
    transaction?: Transaction;
};

export const createPerfectDelete = async ({ itemId, userId, transaction }: PerfectDeleteParams) => {
    await ItemDeleteLogs.create(
        {
            item_id: itemId,
            delete_user_id: userId,
            delete_by_admin: false,
            delete_reason: "自主削除",
        },
        { transaction },
    );
};

export const bulkCreateItemDeleteLogs = async ({ data, transaction }: BulkCreateDeleteLogParams) => {
    await ItemDeleteLogs.bulkCreate(data, { transaction });
};
