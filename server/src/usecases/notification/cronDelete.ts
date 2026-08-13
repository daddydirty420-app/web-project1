import { deleteCronNotification } from "../../services/notification.js";

// expires_at切れnotification削除
export const notificationCronDeleteUseCase = () => {
    return deleteCronNotification({ expiredBefore: new Date() });
};
