import { Transaction } from "sequelize";
import { Delivery, Item, User } from "../../models/index.js";

export type ItemIdParams = {
    itemId: number;
};

export type CreateDeliveryParams = {
    itemId: number;
    user: InstanceType<typeof User>;
    item: InstanceType<typeof Item>;
    transaction?: Transaction;
};

export type UpdateDeliveryCancelParams = {
    delivery: InstanceType<typeof Delivery>;
    data: {
        cancel: boolean;
    };
    transaction?: Transaction;
};
