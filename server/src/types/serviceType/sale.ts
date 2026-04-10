import { Transaction } from "sequelize";
import { Sale } from "../../models/index.js";

export type CreateSaleParams = {
    itemId: number;
    transaction: Transaction;
};

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

export type CreateSaleCopyUploadParams = {
    data: {
        before_price: number;
        item_id: number;
    };
    transaction: Transaction;
};