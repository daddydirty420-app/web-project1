import { Name } from "../models/index.js";
import {
    CreateDeliveryNameParams,
    CreateNameFirstParams,
    CreateNameShopAllowNullParams,
    CreateNameShopParams,
    NameIdParams,
    NameTransactionParams,
    UpdateNameParams,
    UpdateNameUserLogicalDeleteParams,
} from "../types/serviceType/name.js";

export const getName = ({ nameId }: NameIdParams) => {
    return Name.findByPk(nameId);
};

export const createNameFirst = async ({ transaction }: CreateNameFirstParams) => {
    return Name.create({ transaction });
};

export const createDeliveryName = async ({ data, transaction }: CreateDeliveryNameParams) => {
    return Name.create(data, { transaction });
};

export const createNameShop = async ({ data, transaction }: CreateNameShopParams) => {
    return Name.create(data, { transaction });
};

export const createNameShopAllowNull = async ({ data, transaction }: CreateNameShopAllowNullParams) => {
    return Name.create(data, { transaction });
};

export const updateName = async ({ name, data, transaction }: UpdateNameParams) => {
    await name.update(data, { transaction });
};

export const updateNameUserLogicalDelete = async ({ name, data, transaction }: UpdateNameUserLogicalDeleteParams) => {
    await name.update(data, { transaction });
};

export const deleteName = async ({ name, transaction }: NameTransactionParams) => {
    await name.destroy({ transaction });
};
