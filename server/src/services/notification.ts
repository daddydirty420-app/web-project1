import { Notification } from "../models/index.js";
import { CreateNotificationParams, UserIdParams } from "../types/serviceType/notification.js";

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
