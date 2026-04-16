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

export const createDeliveryName = async ({ deliveryId, userName, transaction }: CreateDeliveryNameParams) => {
    return Name.create({
        delivery_id: deliveryId,
        sei: userName?.sei ?? null,
        mei: userName?.mei ?? null,
        sei_kana: userName?.sei_kana ?? null,
        mei_kana: userName?.mei_kana ?? null,
    }, { transaction });
};