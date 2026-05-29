import { Transaction } from "sequelize";
import { Notification } from "../../models/index.js";
import { NotificationType } from "../../config/notification.js";

export type UserIdParams = {
    userId: number;
};

export type NotificationIdParams = {
    notificationId: number;
};

export type CreateNotificationParams = {
    data: {
        read_user_id: number;
        url?: string | null;
        message_image?: string | null;
        message: string;
        type: NotificationType;
    };
    transaction?: Transaction;
};

export type UpdateReadFlagParams = {
    notification: InstanceType<typeof Notification>;
    data: {
        read_flag: boolean;
    };
    transaction?: Transaction;
};

export type UpdateTypeParams = {
    notification: InstanceType<typeof Notification>;
    data: {
        type: NotificationType;
    };
    transaction?: Transaction;
};

export type DeleteNotificationUserIdTransactionParams = {
    userId: number;
    transaction?: Transaction;
};
