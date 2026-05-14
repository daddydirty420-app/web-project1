import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Notification } from "../models/index.js";
import { countUnread } from "../services/notification.js";
import { getUnreadCountRateLimit } from "../middleware/rateLimit/notificationRateLimit.js";

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

router.get(
    "/my-notification",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user!.id;

            const notificationList = await Notification.findAll({
                where: { read_user_id: currentUserId },
                order: [["createdAt", "DESC"]],
            });

            const unreadCount = await Notification.count({
                where: {
                    read_user_id: currentUserId,
                    read_flag: false,
                },
            });

            res.json({
                notificationList: notificationList,
                unreadCount: unreadCount,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
