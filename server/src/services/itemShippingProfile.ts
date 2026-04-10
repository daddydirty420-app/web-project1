import { ItemShippingProfile } from "../models/index.js";
import { CreateShippingCopyUploadParams, CreateShippingParams, UpdateShippingParams } from "../types/serviceType/itemShippingProfile";

export const createShipping = async ({ itemId, transaction }: CreateShippingParams) => {
    await ItemShippingProfile.create({
        item_id: itemId,
    }, { transaction });
};

export const createShippingCopyUpload = async ({ data, transaction}: CreateShippingCopyUploadParams) => {
    await ItemShippingProfile.create(data, { transaction });
};

export const updateShipping = async ({ shipping, data, transaction }: UpdateShippingParams) => {
    await shipping.update(data, { transaction });
};