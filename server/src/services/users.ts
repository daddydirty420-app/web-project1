import { User } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

export const findByPkUser = async ({ userId }: UserIdParams) => {
    return User.findByPk(userId);
};