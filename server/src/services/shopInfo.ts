import { AccountTypeOption, Address, BankAccount, Name, ShopInfo, TodouhukenOption } from "../models/index.js";
import {
    ShopIdParams,
    UpdateShopEmailParams,
    UpdateShopIdCardParams,
    UpdateShopPhoneNumberParams,
} from "../types/serviceType/shopInfo.js";

export const getShop = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId);
};

export const getShopHasBankAccount = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id"],
        include: [
            {
                model: BankAccount,
                attributes: [
                    "id",
                    "bank_name",
                    "branch",
                    "account_type_id",
                    "account_number",
                    "meigi",
                    "bank_code",
                    "branch_code",
                ],
                include: [{ model: AccountTypeOption }],
            },
        ],
    });
};

export const getShopHasAddress = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id"],
        include: [
            {
                model: Address,
                attributes: ["id", "post_number", "todouhuken_id", "shikutyouson", "banchi", "building"],
                include: [
                    {
                        model: TodouhukenOption,
                        as: "AddressTodouhuken",
                    },
                ],
            },
        ],
    });
};

export const getShopHasRepName = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id"],
        include: [
            {
                model: Name,
                as: "RepresentativeName",
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            },
        ],
    });
};

export const getShopHasConName = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id"],
        include: [
            {
                model: Name,
                as: "ContactName",
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            },
        ],
    });
};

export const getShopPhoneNumber = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id", "phone_number", "user_id"],
    });
};

export const updateShopEmail = async ({ shopInfo, data, transaction }: UpdateShopEmailParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopIdCard = async ({ shopInfo, data, transaction }: UpdateShopIdCardParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopPhoneNumber = async ({ shopInfo, data, transaction }: UpdateShopPhoneNumberParams) => {
    await shopInfo.update(data, { transaction });
};
