import { UpdateUsedUriageParams } from "../types/serviceType/uriagekinLots.js";

export const updateUsedUriagekin = async ({ lots, data, transaction }: UpdateUsedUriageParams) => {
    await lots.update(data, { transaction });
};
