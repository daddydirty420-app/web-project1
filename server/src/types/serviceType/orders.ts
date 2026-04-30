import { Transaction } from "sequelize";
import { Orders } from "../../models/index.js";

export type OrderListParams = {
    where: any;
    limit: number;
    offset: number;
};

export type ItemIdParams = {
    itemId: number;
};

export type UpdateOrderStatusParams = {
    order: InstanceType<typeof Orders>;
    data: {
        status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | "returned";
    };
    transaction?: Transaction;
};
