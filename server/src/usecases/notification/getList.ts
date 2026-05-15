import { countUnread, getMyNotificationList } from "../../services/notification.js";

type Params = {
    userId: number;
};

// GET /notification
// summary: お知らせ一覧取得
// page: /notification
export const getNotificationListUseCase = async ({ userId }: Params) => {
    // お知らせリスト取得
    const notificationList = await getMyNotificationList({ userId });

    // 未読カウント取得
    const unreadCount = await countUnread({ userId });

    return { notificationList, unreadCount };
};
