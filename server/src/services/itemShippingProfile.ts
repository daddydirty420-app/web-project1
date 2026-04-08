import { UpdateShippingParams } from "../types/serviceType/itemShippingProfile";

export const updateShipping = async ({ shipping, data, transaction }: UpdateShippingParams) => {
    await shipping.update(data, { transaction });
};