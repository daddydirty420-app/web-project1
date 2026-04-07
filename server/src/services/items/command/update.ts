import { Transaction } from "sequelize";
import { Item } from "../../../models/index.js";

type ItemTransactionParams = {
    item: InstanceType<typeof Item>;
    transaction: Transaction;
};

type SortUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
    };
};

type CountUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        views_count: number;
    };
};

type PublishUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
        search_text: string;
    };
    transaction: Transaction;
};

export const updateSortNumber = async ({ item, data }: SortUpdateParams) => {
    await item.update(data);
};

export const addViewsCount = async ({ item, data }: CountUpdateParams) => {
    await item.update(data);
};

export const updateRestoreItem = async ({ item, transaction }: ItemTransactionParams) => {
    const nowDate = new Date();

    await item.update({
        uploaded_at: nowDate,
        status: "active",
        deleted_at: null,
    }, { transaction });
};

export const updatePublishItem = async ({ item, data, transaction }: PublishUpdateParams) => {
    const nowDate = new Date();

    await item.update({
        status: "active",
        uploaded_at: nowDate,
        save_at: nowDate,
        early_sell: true,
        ...data,
    }, { transaction });
};