import { Item } from "../../../models/index.js";
import { CreateItemCopyUploadParams } from "../../../types/serviceType/items/items.js";

export const createItemCopyUpload = ({ data, transaction }: CreateItemCopyUploadParams) => {
    return Item.create(data, { transaction });
};