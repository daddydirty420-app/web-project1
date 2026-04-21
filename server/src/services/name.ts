import { Name } from "../models/index.js";
import { CreateDeliveryNameParams, CreateNameParams, UserIdParams } from "../types/serviceType/name.js";

export const getNameOne = ({ userId }: UserIdParams) => {
    return Name.findOne({
        where: { user_id: userId },
    });
};

export const createName = async ({ data, transaction }: CreateNameParams) => {
    await Name.create(data, { transaction });
};

export const createDeliveryName = async ({ data, transaction }: CreateDeliveryNameParams) => {
    return Name.create(data, { transaction });
};
