import { IdCard } from "../models/index.js";
import {
    CreateIdParams,
    CreateIdUrlParams,
    IdCardTransactionParams,
    UpdateIdParams,
} from "../types/serviceType/idCard.js";

export const createIdCard = async ({ data, transaction }: CreateIdParams) => {
    await IdCard.create(data, { transaction });
};

export const createIdCardUrl = async ({ data, transaction }: CreateIdUrlParams) => {
    await IdCard.create(data, { transaction });
};

export const updateIdCard = async ({ idCard, data, transaction }: UpdateIdParams) => {
    await idCard.update(data, { transaction });
};

export const deleteIdCard = async ({ idCard, transaction }: IdCardTransactionParams) => {
    await idCard.destroy({ transaction });
};
