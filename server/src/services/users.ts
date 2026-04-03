import { User } from "../models/index.js";

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