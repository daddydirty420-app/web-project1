import { Transaction } from "sequelize";
import { PointLots } from "../models/index.js";

type CreatePointLotsParams = {
    data: {
        points: number;
        user_id: number;
        expires_at: Date;
    };
    transaction?: Transaction;
};

type UpdatePointLotsParams = {
    lot: InstanceType<typeof PointLots>;
    data: {
        used_points: number;
    };
    transaction?: Transaction;
};

export const createPointLots = async ({ data, transaction }: CreatePointLotsParams) => {
    await PointLots.create(data, { transaction });
};

export const updatePointLots = async ({ lot, data, transaction }: UpdatePointLotsParams) => {
    await lot.update(data, { transaction });
};
