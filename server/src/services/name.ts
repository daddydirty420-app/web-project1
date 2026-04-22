import { Name } from "../models/index.js";
import { CreateDeliveryNameParams, CreateNameParams, NameIdParams, UpdateNameParams, UserIdParams } from "../types/serviceType/name.js";

export const getName = ({ nameId }: NameIdParams) => {
    return Name.findByPk(nameId);
};

export const getMyname = ({ userId }: UserIdParams) => {
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

export const updateName = async ({ name, data, transaction }: UpdateNameParams) => {
    await name.update(data, { transaction });
};
