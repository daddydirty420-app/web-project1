import { Notification } from "../models/index.js";
import {
    CreateNotificationParams,
    DeleteNotificationUserIdTransactionParams,
    NotificationIdParams,
    UpdateReadFlagParams,
    UserIdParams,
} from "../types/serviceType/notification.js";

export const getMyNotificationList = ({ userId }: UserIdParams) => {
    return Notification.findAll({
        attributes: ["id", "message", "message_image", "read_flag", "createdAt", "url"],
        where: { read_user_id: userId },
        order: [["createdAt", "DESC"]],
    });
};

export const getNotification = ({ notificationId }: NotificationIdParams) => {
    return Notification.findByPk(notificationId);
};

export const createNotification = async ({ data, transaction }: CreateNotificationParams) => {
    await Notification.create(data, { transaction });
};

export const updateReadFlag = async ({ notification, data, transaction }: UpdateReadFlagParams) => {
    await notification.update(data, { transaction });
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
