import { CountUpdateParams, ItemTransactionParams, PublishUpdateParams, SortUpdateParams, UpdateItemImageParams, UpdateItemParams, UpdatePriceParams } from "../../../types/serviceType/items/items.js";

export const updateSortNumber = async ({ item, data }: SortUpdateParams) => {
    await item.update(data);
};

export const addViewsCount = async ({ item, data }: CountUpdateParams) => {
    await item.update(data);
};

export const updateRestoreItem = async ({ item, transaction }: ItemTransactionParams) => {
    const nowDate = new Date();

    await item.update({
        uploaded_at: nowDate,
        status: "active",
        deleted_at: null,
    }, { transaction });
};

export const updatePublishItem = async ({ item, data, transaction }: PublishUpdateParams) => {
    const nowDate = new Date();

    await item.update({
        status: "active",
        uploaded_at: nowDate,
        save_at: nowDate,
        early_sell: true,
        ...data,
    }, { transaction });
};

export const updateItem = async ({ item, data, transaction }: UpdateItemParams) => {
    const nowDate = new Date();

    await item.update({
        save_at: nowDate,
        ...data,
    }, { transaction });
};

export const updateImage = async ({ item, urls, transaction }: UpdateItemImageParams) => {
    item.setDataValue("image_url", urls);
    item.changed("image_url", true);
    await item.save({ transaction });
};

export const updatePrice = async ({ item, data, transaction }: UpdatePriceParams) => {
    await item.update(data, { transaction });
};