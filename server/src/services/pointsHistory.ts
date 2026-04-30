import { Transaction } from "sequelize";
import { PointsHistory } from "../models/index.js";

type CreatePointsHistoryParams = {
    data: {
        points: number;
        user_id: number;
    };
    transaction?: Transaction;
};

type UpdatePointsHistoryParams = {
    history: InstanceType<typeof PointsHistory>;
    data: {
        used_points: number;
    };
    transaction?: Transaction;
};

export const createPointsHistory = async ({ data, transaction }: CreatePointsHistoryParams) => {
    await PointsHistory.create(data, { transaction });
};

export const updatePointsHistory = async ({ history, data, transaction }: UpdatePointsHistoryParams) => {
    await history.update(data, { transaction });
};
