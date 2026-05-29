import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import {
    getNotificationListRateLimit,
    getUnreadCountRateLimit,
    patchReadFlagRateLimit,
} from "../middleware/rateLimit/notificationRateLimit.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { countUnread } from "../services/notification.js";
import { getNotificationListUseCase } from "../usecases/notification/getList.js";
import { patchReadFlagTrueUseCase } from "../usecases/notification/readFlagTrue.js";
import { editTypeUseCase } from "../usecases/notification/test/editType.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// PATCH /notification/:id/read-flag
// summary: 既読
// page: /notification
router.patch(
    "/:id/read-flag",
    patchReadFlagRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const notificationId = Number(req.params.id);

        try {
            await patchReadFlagTrueUseCase({ notificationId });

            res.status(200).json({ isRead: true });
        } catch (err) {
            next(err);
        }
    },
);

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

// test

router.patch("/type", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const useCase = new editTypeUseCase();

        await useCase.execute();

        res.status(200).json({ message: "type変更完了" });
    } catch (err) {
        next(err);
    }
});

export default router;
