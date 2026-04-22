import { IdCard } from "../models/index.js";
import { Transaction } from "sequelize";

type CreateIdParams = {
    data: {
        user_id?: number;
    };
    transaction?: Transaction;
};

export const createIdCard = async ({ data, transaction }: CreateIdParams) => {
    await IdCard.create(data, { transaction });
};
