import { Transaction } from "sequelize";
import { Delivery } from "../../models/index.js";

export type ItemIdParams = {
    itemId: number;
};

export type DeliveryIdParams = {
    deliveryId: number;
};

export type DeliveryUserIdParams = {
    deliveryId: number;
    userId: number;
};

export type UpdateDeliveryCancelParams = {
    delivery: InstanceType<typeof Delivery>;
    data: {
        cancel: boolean;
    };
    transaction?: Transaction;
};
