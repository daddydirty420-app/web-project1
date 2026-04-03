import { Transaction } from "sequelize";
import { Notification } from "../models/index.js";

type CreateNormalTransactionParams = {
    data: {
        read_user_id: number;
        url: string;
        message_image: string;
        message: string;
    };
    transaction: Transaction;
};

export const createNormalNotification = async ({ data, transaction }: CreateNormalTransactionParams) => {
    await Notification.create(data, { transaction });
};