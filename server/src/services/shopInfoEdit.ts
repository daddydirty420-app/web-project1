import { Transaction } from "sequelize";
import { AccountTypeOption, Address, BankAccount, Name, ShopInfoEdit, TodouhukenOption } from "../models/index.js";

type ShopEditIdParams = {
    shopEditId: number;
};

type CreateShopEditParams = {
    data: {
        user_id: number;
        shop_info_id: number;
    };
    transaction?: Transaction;
};

export const getShopEditHasBankAccount = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
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

export const getShopEditHasAddress = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
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

export const getShopEditHasRepName = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
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

export const getShopEditHasConName = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
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

export const createShopEdit = ({ data, transaction }: CreateShopEditParams) => {
    return ShopInfoEdit.create(data, { transaction });
};
