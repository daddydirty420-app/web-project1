import { ShopInfo, User } from "../models/index.js";
import { CreateUserParams, EmailParams, EmailVerifyParams, UserIdParams } from "../types/serviceType/users.js";

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

export const getUserEmailOne = ({ email }: EmailParams) => {
    return User.findOne({
        where: { email: email },
    });
};

export const createUser = ({ data, transaction }: CreateUserParams) => {
    return User.create(data, { transaction });
};

export const emailVerifyUser = async ({ user, data, transaction }: EmailVerifyParams) => {
    await user.update(data, { transaction });
};