import { InferAttributes, Transaction, WhereOptions } from "sequelize";
import UriagekinLots from "../../models/uriagekin_lots.js";

export type GetExpiredUriageAllParams = {
    where: WhereOptions<InferAttributes<UriagekinLots>>;
};

export type UpdateUsedUriageParams = {
    lots: InstanceType<typeof UriagekinLots>;
    data: {
        used_uriagekin: number;
    };
    transaction?: Transaction;
};