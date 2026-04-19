import { ShopInfo, User } from "../../models/index.js";
import { EmailParams, UserIdParams } from "../../types/serviceType/users.js";

export const getUser = ({ userId }: UserIdParams) => {
    return User.findByPk(userId);
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

export const getUserEmailOne = ({ email }: EmailParams) => {
    return User.findOne({
        where: { email: email },
    });
};
