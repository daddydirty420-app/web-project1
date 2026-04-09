import { ItemShippingProfile } from "../models/index.js";
import { CreateShippingCopyUploadParams, UpdateShippingParams } from "../types/serviceType/itemShippingProfile";

export const updateShipping = async ({ shipping, data, transaction }: UpdateShippingParams) => {
    await shipping.update(data, { transaction });
};

export const createShippingCopyUpload = async ({ data, transaction}: CreateShippingCopyUploadParams) => {
    await ItemShippingProfile.create(data, { transaction });
};