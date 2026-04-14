import { Notification } from "../models/index.js";
import { CreateNormalTransactionParams, UserIdParams } from "../types/serviceType/notification.js";

export const createNormalNotification = async ({ data, transaction }: CreateNormalTransactionParams) => {
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