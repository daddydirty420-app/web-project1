import rateLimit from "express-rate-limit";
import { AuthUser } from "../../authMiddleware.js";

export const adminDeleteItemRateLimit = rateLimit({
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

export const adminItemPageRateLimit = rateLimit({
    windowMs: 1000 * 10,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const authReq = req as unknown as {
            user: AuthUser;
        };

        return `admin:${authReq.user.id}`;
    },
});
