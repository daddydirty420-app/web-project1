import { Transaction } from "sequelize";
import { ItemDeleteLogs } from "../models/index.js";

type PerfectDeleteParams = {
    itemId: number;
    userId: number;
    transaction: Transaction;
};

export const createPerfectDelete = async ({ itemId, userId, transaction }: PerfectDeleteParams) => {
    await ItemDeleteLogs.create({
        item_id: itemId,
        delete_user_id: userId,
        delete_by_admin: false,
        delete_reason: "自主削除"
    }, { transaction });
};