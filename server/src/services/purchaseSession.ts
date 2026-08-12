import { Op } from "sequelize";
import { PurchaseSession } from "../models/index.js";
import type { CreatePurchaseSessionParams, CronDeleteParams } from "../types/serviceType/purchaseSession.js";

export const createPurchaseSession = ({ data, transaction }: CreatePurchaseSessionParams) => {
    return PurchaseSession.create(data, { transaction });
};

export const deleteCron = async ({ now, transaction }: CronDeleteParams) => {
    return PurchaseSession.destroy(
        {
            where: {
                expires_at: { [Op.lt]: now },
            },
        },
        transaction,
    );
};
