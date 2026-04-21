import { Transaction } from "sequelize";
import { AccountTypeOption, BankAccount, ShopInfoEdit } from "../models/index.js";

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

export const getShopEditWithBankAccount = ({ shopEditId }: ShopEditIdParams) => {
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

export const createShopEdit = ({ data, transaction }: CreateShopEditParams) => {
    return ShopInfoEdit.create(data, { transaction });
};