import { Transaction } from "sequelize";
import { Name } from "../../models/index.js";

export type UserIdParams = {
    userId: number;
};

export type CreateNameParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
};

export type CreateDeliveryNameParams = {
    deliveryId: number;
    userName?: InstanceType<typeof Name>;
    transaction: Transaction;
};