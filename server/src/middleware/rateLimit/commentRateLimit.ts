import rateLimit from "express-rate-limit";
import { AuthUser } from "../authMiddleware.js";

export const createCommentRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const authReq = req as unknown as {
            user: AuthUser;
        };

        return `admin:${authReq.user.id}`;
    },
});

export const deleteCommentRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const authReq = req as unknown as {
            user: AuthUser;
        };

        return `admin:${authReq.user.id}`;
    },
});

export const editSortCommentRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

export const getCommentListRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
});

export const getReplyListRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
});
