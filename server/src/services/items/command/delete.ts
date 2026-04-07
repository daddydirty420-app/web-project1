import { Transaction } from "sequelize";
import { Item } from "../../../models/index.js";

type ItemDataParams = {
    item: InstanceType<typeof Item>;
};

type ItemTransactionParams = {
    item: InstanceType<typeof Item>;
    transaction: Transaction;
};

type LogicalDeleteParams = {
    item: InstanceType<typeof Item>;
    data: {
        price: number;
    };
    transaction: Transaction;
};

export const updateLogicalDeleteItem = async ({ item, data, transaction }: LogicalDeleteParams) => {
    const nowDate = new Date();

    await item.update({
        uploaded_at: null,
        sort_number: 0,
        sort_buzz_number: 0,
        status: "deleted",
        deleted_at: nowDate,
        ...data,
    }, { transaction });
};

export const destroyDraftItem = async ({ item }: ItemDataParams) => {
    await item.destroy();
};

export const destroyPerfectItem = async ({ item, transaction }: ItemTransactionParams) => {
    await item.destroy({ transaction });
};