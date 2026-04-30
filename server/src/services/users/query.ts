import {
    AccountTypeOption,
    Address,
    BankAccount,
    GenderOption,
    IdCard,
    Name,
    ShopInfo,
    TodouhukenOption,
    UriagekinHistory,
    User,
} from "../../models/index.js";
import { EmailParams, UserIdParams } from "../../types/serviceType/users.js";

export const getUser = ({ userId }: UserIdParams) => {
    return User.findByPk(userId);
};

export const getUserHasShop = async ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        include: [
            {
                model: ShopInfo,
                where: { verified: true },
                required: false,
            },
        ],
    });
};

export const getUserWithAddressNameId = async ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
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
            { model: Name },
            { model: IdCard },
        ],
    });
};

export const getUserHasUriagekin = async ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        include: [{ model: UriagekinHistory }],
    });
};

export const getMeHighlight = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "user_name", "profile_image"],
    });
};

export const getProfileMetadata = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["user_name", "user_introduction"],
    });
};

export const getStar = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["star_average"],
    });
};

export const getInquiryUser = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "user_name", "email"],
    });
};

export const getMePhoneNumber = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "phone_number"],
    });
};

export const getMeMypage = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "user_name", "profile_image", "early_seller", "honnin_verified", "points", "uriagekin"],
        include: [
            {
                model: ShopInfo,
                where: { verified: true },
                attributes: ["id"],
                required: false,
            },
        ],
    });
};

export const getProfileUser = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: [
            "id",
            "user_name",
            "user_introduction",
            "profile_image",
            "early_seller",
            "honnin_verified",
            "star_amount",
            "star_average",
        ],
        include: [
            {
                model: ShopInfo,
                where: { verified: true },
                attributes: ["id"],
                required: false,
            },
        ],
    });
};

export const getProfileEditUser = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "user_name", "user_introduction", "profile_image"],
    });
};

export const getHonninEditUser = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "birthday", "phone_number", "gender_id"],
        include: [
            { model: GenderOption },
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
            {
                model: Name,
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            },
            {
                model: IdCard,
                attributes: ["id", "id_card_front", "id_card_rear"],
            },
        ],
    });
};

export const getUserShopSignup1 = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "user_name", "email", "phone_number"],
        include: [
            {
                model: Address,
                attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                include: [
                    {
                        model: TodouhukenOption,
                        as: "AddressTodouhuken",
                    },
                ],
            },
            {
                model: Name,
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            },
        ],
    });
};

export const getMePointsUriage = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "points", "uriagekin"],
    });
};

export const getUserTransferRequest = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", "uriagekin"],
        include: [
            {
                model: BankAccount,
                attributes: ["id", "bank_name", "branch", "account_type_id", "account_number", "meigi"],
                include: [{ model: AccountTypeOption }],
            },
        ],
    });
};

export const getUserPenaltyUriage = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["penalty_points", "uriagekin"],
    });
};

export const getUserEmailOne = ({ email }: EmailParams) => {
    return User.findOne({
        where: { email },
    });
};

// メールアドレス被りチェック
export const getAllEmail = ({ email }: EmailParams) => {
    return User.findAll({
        where: { email },
    });
};
