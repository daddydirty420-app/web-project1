import {
    AccountTypeOption,
    Address,
    BankAccount,
    Name,
    ShopInfo,
    ShopInfoEdit,
    TodouhukenOption,
} from "../models/index.js";
import {
    CreateShopEditParams,
    CreateShopEditWithIdCardParams,
    ShopEditIdParams,
} from "../types/serviceType/shopInfoEdit.js";

export const getShopEditHasBankAccount = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
        attributes: ["id", "user_id"],
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

export const getShopEditHasAddress = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
        attributes: ["id", "user_id"],
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

export const getShopEditHasRepName = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
        attributes: ["id", "user_id"],
        include: [
            {
                model: Name,
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            },
        ],
    });
};

export const getShopEditHasConName = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
        attributes: ["id", "user_id"],
        include: [
            {
                model: ShopInfo,
                attributes: ["id"],
                include: [
                    {
                        model: Name,
                        as: "ContactName",
                        attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    },
                ],
            },
        ],
    });
};

export const createShopEdit = ({ data, transaction }: CreateShopEditParams) => {
    return ShopInfoEdit.create(data, { transaction });
};

export const createShopEditWithIdCard = ({ data, transaction }: CreateShopEditWithIdCardParams) => {
    return ShopInfoEdit.create(data, { transaction });
};
