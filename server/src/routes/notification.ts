import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import {
    getNotificationListRateLimit,
    getUnreadCountRateLimit,
} from "../middleware/rateLimit/notificationRateLimit.js";
import { countUnread } from "../services/notification.js";
import { getNotificationListUseCase } from "../usecases/notification/getList.js";

const router = Router();

// GET /notification/unread-count
// summary: 未読通知カウント
// page: footer, /my-page
router.get(
    "/unread-count",
    getUnreadCountRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const unreadCount = await countUnread({ userId });

            res.status(200).json({ unreadCount });
        } catch (err) {
            next(err);
        }
    },
);

// GET /notification
// summary: お知らせ一覧取得
// page: /notification
router.get(
    "/",
    getNotificationListRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const { notificationList, unreadCount } = await getNotificationListUseCase({ userId });

            res.status(200).json({ notificationList, unreadCount });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
