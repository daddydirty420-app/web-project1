import { User } from "../../models/index.js";
import { CreateUserParams, EmailVerifyParams, UpdateEmailParams, UpdatePasswordParams } from "../../types/serviceType/users.js";

export const createUser = ({ data, transaction }: CreateUserParams) => {
    return User.create(data, { transaction });
};

export const emailVerifyUser = async ({ user, data, transaction }: EmailVerifyParams) => {
    await user.update(data, { transaction });
};

export const updatePasswordUser = async ({ user, data, transaction }: UpdatePasswordParams) => {
    await user.update(data, { transaction });
};

export const updateEmailUser = async ({ user, data, transaction }: UpdateEmailParams) => {
    await user.update(data, { transaction });
};
