import { Transaction } from "sequelize";
import { UriagekinHistory } from "../models/index.js";

type UpdateUsedUriageParams = {
    history: InstanceType<typeof UriagekinHistory>;
    data: {
        used_uriagekin: number;
    };
    transaction?: Transaction;
};

export const updateUsedUriagekin = async ({ history, data, transaction }: UpdateUsedUriageParams) => {
    await history.update(data, { transaction });
};
