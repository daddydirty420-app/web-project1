import { Transaction } from "sequelize";
import { Sale } from "../../models/index.js";

export type LogicalDeleteUpdateParams = {
    sale: InstanceType<typeof Sale>;
    transaction: Transaction;
};

export type UpdateSaleParams = {
    sale: InstanceType<typeof Sale>;
    data: {
        before_price: number;
    };
    transaction: Transaction;
};