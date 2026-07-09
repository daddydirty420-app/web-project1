import { Transaction } from "sequelize";
import { PointLots } from "../models/index.js";

type UpdatePointLotsParams = {
    lot: InstanceType<typeof PointLots>;
    data: {
        used_points: number;
    };
    transaction?: Transaction;
};

export const updatePointLots = async ({ lot, data, transaction }: UpdatePointLotsParams) => {
    await lot.update(data, { transaction });
};
