import rateLimit from "express-rate-limit";
import { AuthUser } from "../authMiddleware.js";

export const playVideoLogRateLimit = rateLimit({
    windowMs: 1000 * 60 * 10,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const authReq = req as unknown as {
            user: AuthUser;
        };

        return `admin:${authReq.user.id}`;
    },
});

export const convertVideoRateLimit = rateLimit({
    windowMs: 1000 * 60 * 10,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const authReq = req as unknown as {
            user: AuthUser;
        };

        return `admin:${authReq.user.id}`;
    },
});
