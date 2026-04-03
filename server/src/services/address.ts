import { Transaction } from "sequelize";
import { Address } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

type CreateDeliveryAddressParams = {
    deliveryId: number;
    userAddress?: InstanceType<typeof Address>;
    transaction: Transaction;
};

export const findAddress = async ({ userId }: UserIdParams) => {
    return Address.findOne({
        where: { user_id: userId },
    });
};

export const createDeliveryAddress = async ({ deliveryId, userAddress, transaction }: CreateDeliveryAddressParams) => {
    return Address.create({
        delivery_id: deliveryId,
        post_number: userAddress?.post_number ?? null,
        todouhuken_id: userAddress?.todouhuken_id ?? null,
        shikutyouson: userAddress?.shikutyouson ?? null,
        banchi: userAddress?.banchi ?? null,
        building: userAddress?.building ?? null,
    }, { transaction });
};