import { Transaction } from "sequelize";
import { PointsUriageOver } from "../models/index.js";

type CreateOverConfiscatedParams = {
    data: {
        points_confiscated: number;
        uriagekin_confiscated: number;
    };
    transaction?: Transaction;
};

export const createOverConfiscated = async ({ data, transaction }: CreateOverConfiscatedParams) => {
    await PointsUriageOver.create(data, { transaction });
};
