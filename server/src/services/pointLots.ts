import { PointLots } from "../models/index.js";
import { CreatePointLotsParams, GetExpiredAllParams, UpdatePointLotsParams } from "../types/serviceType/pointLots.js";

export const getExpiredAll = ({ where }: GetExpiredAllParams) => {
    return PointLots.findAll({ where });
};

export const createPointLots = async ({ data, transaction }: CreatePointLotsParams) => {
    await PointLots.create(data, { transaction });
};

export const updatePointLots = async ({ lot, data, transaction }: UpdatePointLotsParams) => {
    await lot.update(data, { transaction });
};
