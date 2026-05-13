import rateLimit from "express-rate-limit";
import { AuthUser } from "../authMiddleware.js";

export const commentReportRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const authReq = req as unknown as {
            user: AuthUser;
        };

        return `admin:${authReq.user.id}`;
    },
});

export const getCommentReportRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 150,
    standardHeaders: true,
    legacyHeaders: false,
});
