import rateLimit from "express-rate-limit";
import { AuthUser } from "../authMiddleware.js";

export const nameEditRateLimit = rateLimit({
    windowMs: 1000 * 60 * 10,
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

export const getNameRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
