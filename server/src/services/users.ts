import { ShopInfo, User } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

export const findByPkUser = async ({ userId }: UserIdParams) => {
    return User.findByPk(userId);
};

export const getMeHighlight = async ({ userId }: UserIdParams) => {
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

export const findByPkHasShop = async ({ userId }: UserIdParams) => {
    return User.findByPk(userId, {
        include: [
            {
                model: ShopInfo,
                required: false,
            },
        ],
    });
};