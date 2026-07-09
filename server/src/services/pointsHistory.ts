import { Transaction } from "sequelize";
import { PointsHistory } from "../models/index.js";

type CreatePointsHistoryParams = {
    data: {
        points: number;
        reason_id: number;
        user_id: number;
    };
    transaction?: Transaction;
};

export const createPointsHistory = async ({ data, transaction }: CreatePointsHistoryParams) => {
    await PointsHistory.create(data, { transaction });
};
