import { AppError } from "../../errors.js";
import { getNotification, updateReadFlag } from "../../services/notification.js";

type Params = {
    notificationId: number;
};

// PATCH /notification/read-flag/:id
// summary: 既読
// page: /notification
export const patchReadFlagTrueUseCase = async ({ notificationId }: Params) => {
    // notification取得
    const notification = await getNotification({ notificationId });

    if (!notification) throw new AppError("NOTIFICATION_NOT_FOUND", 404);

    // readFlag既読
    await updateReadFlag({
        notification,
        data: { read_flag: true },
    });
};
