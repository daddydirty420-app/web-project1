import { ShopInfo, User } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

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
        attributes: ['user_name', 'user_introduction'],
    });
};

export const getStar = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ['star_average'],
    });
};

export const getMeMypage = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'points', 'uriagekin'],
        include: [
            {
                model: ShopInfo,
                where: { verified: true },
                attributes: ['id'],
                required: false,
            },
        ],
    });
};

export const getProfileUser = ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        attributes: ["id", 'user_name', 'user_introduction', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
        include: [
            {
                model: ShopInfo,
                where: { verified: true },
                attributes: ['id'],
                required: false,
            },
        ],
    });
};

export const getHasShop = async ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        include: [
            {
                model: ShopInfo,
                required: false,
            },
        ],
    });
};