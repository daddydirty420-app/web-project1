import { InferAttributes, Transaction, WhereOptions } from "sequelize";
import PointLots from "../../models/point_lots.js";

export type GetExpiredAllParams = {
    where: WhereOptions<InferAttributes<PointLots>>;
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
