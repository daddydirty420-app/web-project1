import {
    AccountTypeOption,
    Address,
    BankAccount,
    ComOrFreeOption,
    Name,
    ShopInfo,
    TodouhukenOption,
} from "../../models/index.js";
import { ShopIdParams, UserIdParams } from "../../types/serviceType/shopInfo.js";

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

export const getShopIdCard = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: ["id", "id_card_front", "id_card_rear", "permit_url", "user_id"],
    });
};

export const getShopSignup5 = ({ shopId }: ShopIdParams) => {
    return ShopInfo.findByPk(shopId, {
        attributes: [
            "id",
            "company_name",
            "shop_name",
            "phone_number",
            "email",
            "open_date_time",
            "founded_date",
            "member_count",
            "homepage_url",
            "company_number",
            "capital",
            "auto_trans",
            "open_info",
            "user_id",
        ],
        include: [
            {
                model: ComOrFreeOption,
            },
            {
                model: Name,
                as: "RepresentativeName",
                attributes: ["sei", "mei", "sei_kana", "mei_kana"],
            },
            {
                model: Name,
                as: "ContactName",
                attributes: ["sei", "mei", "sei_kana", "mei_kana"],
            },
            {
                model: Address,
                attributes: ["post_number", "shikutyouson", "banchi", "building"],
                include: [
                    {
                        model: TodouhukenOption,
                        as: "AddressTodouhuken",
                    },
                ],
            },
            {
                model: BankAccount,
                attributes: ["bank_name", "branch_code", "account_number", "meigi"],
                include: [{ model: AccountTypeOption }],
            },
        ],
    });
};

export const getShopSignup1One = ({ userId }: UserIdParams) => {
    return ShopInfo.findOne({
        attributes: [
            "id",
            "company_name",
            "shop_name",
            "email",
            "phone_number",
            "homepage_url",
            "open_date_time",
            "company_number",
            "capital",
            "member_count",
            "founded_date",
            "user_id",
        ],
        where: {
            user_id: userId,
            request_all: false,
        },
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: ComOrFreeOption,
                required: false,
            },
            {
                model: Address,
                attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                include: [
                    {
                        model: TodouhukenOption,
                        as: "AddressTodouhuken",
                        required: false,
                    },
                ],
                required: false,
            },
            {
                model: Name,
                as: "RepresentativeName",
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                required: false,
            },
            {
                model: Name,
                as: "ContactName",
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                required: false,
            },
        ],
        require: false,
    });
};
