import type { Transaction } from "sequelize";
import type PointLots from "../../models/point_lots.js";

export type GetExpiredAllParams = {
    expiredBefore: Date;
};

export type CreatePointLotsParams = {
    data: {
        points: number;
        user_id: number;
        expires_at: Date;
    };
    transaction?: Transaction;
};

export type UpdatePointLotsParams = {
    lot: InstanceType<typeof PointLots>;
    data: {
        used_points: number;
    };
    transaction?: Transaction;
};
