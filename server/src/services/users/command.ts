import { User } from "../../models/index.js";
import {
    CreateUserParams,
    EmailVerifyParams,
    UpdateEmailParams,
    UpdateHonninParams,
    UpdatePasswordParams,
    UpdatePhoneNumberParams,
    UpdateProfileParams,
} from "../../types/serviceType/users.js";

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

export const updatePhoneNumberUser = async ({ user, data, transaction }: UpdatePhoneNumberParams) => {
    await user.update(data, { transaction });
};

export const updateProfileUser = async ({ user, data, transaction }: UpdateProfileParams) => {
    await user.update(data, { transaction });
};

export const updateHonninUser = async ({ user, data, transaction }: UpdateHonninParams) => {
    await user.update(data, { transaction });
};
