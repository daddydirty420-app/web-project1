import { Transaction } from "sequelize";
import { PointConversionLogs } from "../models/index.js";

type CreatePointLogParams = {
    data: {
        converted_points: number;
        before_points: number;
        after_points: number;
        reason: string;
        plus: boolean;
        user_id: number;
    };
    transaction?: Transaction;
};

export const CreatePointConversionLogs = async ({ data, transaction }: CreatePointLogParams) => {
    await PointConversionLogs.create(data, { transaction });
};
