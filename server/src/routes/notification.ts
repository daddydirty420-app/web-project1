import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Notification } from "../models/index.js";

const router = Router();

router.get('/my-notification', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user!.id;

        const notificationList = await Notification.findAll({
            where: { read_user_id: currentUserId },
            order: [['createdAt', 'DESC']]
        });

        const unreadCount = await Notification.count({
            where: {
                read_user_id: currentUserId,
                read_flag: false,
            }
        });

        res.json({
            notificationList: notificationList,
            unreadCount: unreadCount
        });
    } catch (err) {
        next(err);
    }
});

router.get('/unread-count', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const unreadCount = await Notification.count({
            where: {
                read_user_id: req.user!.id,
                read_flag: false,
            },
        });

        res.json({ unreadCount });
    } catch (err) {
        next(err);
    }
});

export default router;