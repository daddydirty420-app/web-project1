import { Name } from "../models/index.js";
import {
    CreateDeliveryNameParams,
    CreateNameParams,
    CreateNameShopAllowNullParams,
    CreateNameShopParams,
    DeliveryIdParams,
    NameIdParams,
    NameTransactionParams,
    UpdateNameParams,
    UpdateNameUserLogicalDeleteParams,
} from "../types/serviceType/name.js";

export const getName = ({ nameId }: NameIdParams) => {
    return Name.findByPk(nameId);
};

export const getDeliveryNameOne = ({ deliveryId }: DeliveryIdParams) => {
    return Name.findOne({
        attributes: ["id", "sei", "mei", "sei_kana", "mei_kana", "delivery_id"],
        where: { delivery_id: deliveryId },
    });
};

export const createName = async ({ data, transaction }: CreateNameParams) => {
    await Name.create(data, { transaction });
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
