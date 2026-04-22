import { Name } from "../models/index.js";
import {
    CreateDeliveryNameParams,
    CreateNameParams,
    CreateRepNameParams,
    DeliveryIdParams,
    NameIdParams,
    UpdateNameParams,
    UserIdParams,
} from "../types/serviceType/name.js";

export const getName = ({ nameId }: NameIdParams) => {
    return Name.findByPk(nameId);
};

export const getNameOne = ({ userId }: UserIdParams) => {
    return Name.findOne({
        where: { user_id: userId },
    });
};

export const getMyNameOne = ({ userId }: UserIdParams) => {
    return Name.findOne({
        attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
        where: { user_id: userId },
    });
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

export const createRepNameShopEdit = async ({ data, transaction }: CreateRepNameParams) => {
    return Name.create(data, { transaction });
};

export const updateName = async ({ name, data, transaction }: UpdateNameParams) => {
    await name.update(data, { transaction });
};
