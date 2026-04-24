import {
    AccountTypeOption,
    Address,
    BankAccount,
    ComOrFreeOption,
    Name,
    ShopInfo,
    TodouhukenOption,
} from "../../models/index.js";
import { ShopIdParams } from "../../types/serviceType/shopInfo.js";

export const getShop = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId);
};

export const getShopHasBankAccount = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
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

export const getShopHasAddress = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
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

export const getShopHasRepName = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id", "user_id"],
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
        attributes: ["id", "user_id"],
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

export const getShopHasComFree = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id", "company_name", "com_or_free_id", "user_id"],
        include: [{ model: ComOrFreeOption }],
    });
};

export const getShopOption = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id", "auto_trans", "open_info", "user_id"],
    });
};

export const getShopHasAddressNameBank = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        include: [
            { model: Address },
            {
                model: Name,
                as: "RepresentativeName",
            },
            {
                model: Name,
                as: "ContactName",
            },
            { model: BankAccount },
        ],
    });
};
