import { Transaction } from "sequelize";
import { Address } from "../../models/index.js";

export type UserIdParams = {
    userId: number;
};

export type CreateAddressParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
};

export type CreateDeliveryAddressParams = {
    deliveryId: number;
    userAddress?: InstanceType<typeof Address>;
    transaction?: Transaction;
};
