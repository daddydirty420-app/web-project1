import { PurchaseSession } from "../models/index.js";
import type { CreatePurchaseSessionParams } from "../types/serviceType/purchaseSession.js";

export const createPurchaseSession = ({ data, transaction }: CreatePurchaseSessionParams) => {
    return PurchaseSession.create(data, { transaction });
};
