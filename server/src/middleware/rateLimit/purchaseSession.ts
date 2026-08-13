import rateLimit from "express-rate-limit";

import type { AuthUser } from "../authMiddleware.js";

export const createPurchaseSessionRateLimit = rateLimit({
    windowMs: 1000 * 60 * 10,
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

export const getAddressRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
