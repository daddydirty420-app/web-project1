import rateLimit from "express-rate-limit";
import { AuthUser } from "../authMiddleware.js";

export const saleRateLimit = rateLimit({
    windowMs: 1000 * 60 * 5,
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

export const saleStopRateLimit = rateLimit({
    windowMs: 1000 * 60 * 5,
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
