import { Transaction } from "sequelize";
import { Name } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

type CreateDeliveryNameParams = {
    deliveryId: number;
    userName?: InstanceType<typeof Name>;
    transaction: Transaction;
};

export const findName = async ({ userId }: UserIdParams) => {
    return Name.findOne({
        where: { user_id: userId },
    });
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