import { Op } from "sequelize";
import { User } from "../../models/index.js";
import type {
    CreateUserParams,
    DestroyUnverifiedUsersParams,
    EmailVerifyParams,
    UpdateEmailParams,
    UpdateHonninParams,
    UpdatePasswordParams,
    UpdatePhoneNumberParams,
    UpdateProfileParams,
    UpdateReportTrustScoreUserParams,
    UpdateUserIdCardIdParams,
    UpdateUserLogicalDeleteParams,
    UpdateUserPenaltyParams,
    UpdateUserPointsUriageParams,
    UpdateUserUriageParams,
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

export const updatePointsUriageUser = async ({ user, data, transaction }: UpdateUserPointsUriageParams) => {
    await user.update(data, { transaction });
};

export const updateUriageUser = async ({ user, data, transaction }: UpdateUserUriageParams) => {
    await user.update(data, { transaction });
};

export const updatePenaltyUser = async ({ user, data, transaction }: UpdateUserPenaltyParams) => {
    await user.update(data, { transaction });
};

export const updateIdCardIdUser = async ({ user, data, transaction }: UpdateUserIdCardIdParams) => {
    await user.update(data, { transaction });
};

export const updateUserLogicalDelete = async ({ user, data, transaction }: UpdateUserLogicalDeleteParams) => {
    await user.update(data, { transaction });
};

export const destroyUnverifiedUsers = async ({
    userIds,
    transaction,
}: DestroyUnverifiedUsersParams): Promise<void> => {
    await User.destroy({
        where: {
            id: { [Op.in]: userIds },
            email_verified: false,
        },
        transaction,
    });
};

export const updateReportTrustScoreUser = async ({
    user,
    data,
    transaction,
}: UpdateReportTrustScoreUserParams): Promise<void> => {
    await user.update(data, { transaction });
};
