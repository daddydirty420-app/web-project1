import { UriagekinLots } from "../models/index.js";
import { GetExpiredUriageAllParams, UpdateUsedUriageParams } from "../types/serviceType/uriagekinLots.js";

export const getExpiredUriageAll = ({ where }: GetExpiredUriageAllParams) => {
    return UriagekinLots.findAll({ where });
};

export const updateUsedUriagekin = async ({ lots, data, transaction }: UpdateUsedUriageParams) => {
    await lots.update(data, { transaction });
};
