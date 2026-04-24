import {
    AccountTypeOption,
    Address,
    BankAccount,
    ComOrFreeOption,
    Name,
    ShopInfo,
    ShopInfoEdit,
    TodouhukenOption,
} from "../../models/index.js";
import { ShopEditIdParams } from "../../types/serviceType/shopInfoEdit.js";

export const getShopEdit = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId);
};

export const getShopEditHasShop = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
        include: [{ model: ShopInfo }],
    });
};

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
                as: "RepresentativeNameEdit",
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
                model: Name,
                as: "ContactNameEdit",
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            },
        ],
    });
};

export const getShopEditComFreeConfirm = ({ shopEditId }: ShopEditIdParams) => {
    return ShopInfoEdit.findByPk(shopEditId, {
        include: [
            {
                model: Address,
                include: [
                    {
                        model: TodouhukenOption,
                        as: "AddressTodouhuken",
                    },
                ],
            },
            {
                model: Name,
                as: "RepresentativeNameEdit",
            },
            {
                model: Name,
                as: "ContactNameEdit",
            },
            {
                model: BankAccount,
                include: [{ model: AccountTypeOption }],
            },
            { model: ComOrFreeOption },
            {
                model: ShopInfo,
                attributes: [
                    "id",
                    "company_name",
                    "email",
                    "phone_number",
                    "homepage_url",
                    "open_date_time",
                    "company_number",
                    "capital",
                    "member_count",
                ],
                include: [
                    {
                        model: Address,
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: Name,
                        as: "RepresentativeName",
                    },
                    {
                        model: Name,
                        as: "ContactName",
                    },
                    {
                        model: BankAccount,
                        include: [{ model: AccountTypeOption }],
                    },
                    { model: ComOrFreeOption },
                ],
            },
        ],
    });
};
