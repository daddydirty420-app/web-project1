import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Notification } from "../models/index.js";

const router = Router();

router.get('/my-notification', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user!.id;

        const notificationList = await Notification.findAll({
            where: { read_user_id: currentUserId },
            order: [['createdAt', 'DESC']]
        });

        if (!notificationList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        const unreadCount = await Notification.count({
            where: {
                read_user_id: currentUserId,
                read_flag: false
            }
        });

        res.json({
            notificationList: notificationList,
            unreadCount: unreadCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/unread-count', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const unreadCount = await Notification.count({
            where: {
                read_user_id: req.user!.id,
                read_flag: false
            }
        });

        res.json({ unreadCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;