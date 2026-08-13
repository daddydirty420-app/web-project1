import { Op, Transaction } from "sequelize";
import { NotificationType } from "../../config/notification.js";
import { Notification } from "../../models/index.js";

export type UserIdParams = {
    userId: number;
};

export type NotificationIdParams = {
    notificationId: number;
};

export type NotificationUserIdParams = {
    notificationId: number;
    userId: number;
};

export type NotificationListParams = {
    where:
        | {
              read_user_id: number;
              createdAt: {
                  [Op.lt]: Date;
              };
          }
        | {
              read_user_id: number;
          };
    limit: number;
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

export type CronDeleteNotificationParams = {
    expiredBefore: Date;
};
