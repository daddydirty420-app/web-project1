import { Notification } from "../models/index.js";
import {
    CreateNotificationParams,
    DeleteNotificationUserIdTransactionParams,
    UserIdParams,
} from "../types/serviceType/notification.js";

export const getMyNotificationList = ({ userId }: UserIdParams) => {
    return Notification.findAll({
        where: { read_user_id: userId },
        order: [["createdAt", "DESC"]],
    });
};

export const createNotification = async ({ data, transaction }: CreateNotificationParams) => {
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

export const deleteNotificationUserLogical = async ({
    userId,
    transaction,
}: DeleteNotificationUserIdTransactionParams) => {
    await Notification.destroy(
        {
            where: { read_user_id: userId },
        },
        { transaction },
    );
};
