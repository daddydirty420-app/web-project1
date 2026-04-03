import { Transaction } from "sequelize";
import { Sale } from "../models/index.js"

type LogicalDeleteUpdateParams = {
    sale: InstanceType<typeof Sale>;
    transaction: Transaction;
};

export const updateLogicalDelete = async ({ sale, transaction }: LogicalDeleteUpdateParams) => {
    await sale.update({
        discount_rate: 0,
        discount_amount: 0,
        sale_flag: false,
    }, { transaction });
};