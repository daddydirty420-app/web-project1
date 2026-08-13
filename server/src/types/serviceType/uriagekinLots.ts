import type { Transaction } from "sequelize";
import type UriagekinLots from "../../models/uriagekin_lots.js";

export type UriagekinLotsInstance = InstanceType<typeof UriagekinLots>;

export type GetExpiredUriageAllParams = {
    expiredBefore: Date;
};

export type UpdateUsedUriageParams = {
    lots: InstanceType<typeof UriagekinLots>;
    data: {
        used_uriagekin: number;
    };
    transaction?: Transaction;
};
