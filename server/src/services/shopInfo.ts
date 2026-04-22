import { Transaction } from "sequelize";
import { AccountTypeOption, Address, BankAccount, ShopInfo, TodouhukenOption } from "../models/index.js";

type ShopIdParams = {
    shopId: number;
};

type UpdateShopEmailParams = {
    shopInfo: InstanceType<typeof ShopInfo>;
    data: {
        email: string;
    };
    transaction?: Transaction;
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

export const updateEmailShop = async ({ shopInfo, data, transaction }: UpdateShopEmailParams) => {
    await shopInfo.update(data, { transaction });
};
