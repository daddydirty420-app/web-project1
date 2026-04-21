import { Notification } from "../models/index.js";
import {
    CreateNormalTransactionParams,
    CreateUserMessageParams,
    UserIdParams,
} from "../types/serviceType/notification.js";

export const createNormalNotification = async ({ data, transaction }: CreateNormalTransactionParams) => {
    await Notification.create(data, { transaction });
};

export const createUserMessageNotification = async ({ data, transaction }: CreateUserMessageParams) => {
    await Notification.create(data, { transaction });
};

export const countUnread = ({ userId }: UserIdParams) => {
    return Notification.count({
        where: {
            read_user_id: userId,
            read_flag: false,
        },
    });
};
