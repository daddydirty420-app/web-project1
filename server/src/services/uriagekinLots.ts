import { Transaction } from "sequelize";
import { UriagekinLots } from "../models/index.js";

type UpdateUsedUriageParams = {
    lots: InstanceType<typeof UriagekinLots>;
    data: {
        used_uriagekin: number;
    };
    transaction?: Transaction;
};

export const updateUsedUriagekin = async ({ lots, data, transaction }: UpdateUsedUriageParams) => {
    await lots.update(data, { transaction });
};
