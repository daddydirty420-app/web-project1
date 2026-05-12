import rateLimit from "express-rate-limit";
import { AuthUser } from "../../authMiddleware.js";

export const adminDeleteUserRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 6,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        const authReq = req as unknown as {
            user: AuthUser;
        };

        return `admin:${authReq.user.id}`;
    },
});

export const adminAddPenaltyRateLimit = rateLimit({
    windowMs: 1000 * 60,
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

export const adminDeleteUriageRateLimit = rateLimit({
    windowMs: 1000 * 60,
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

export const adminProfileRateLimit = rateLimit({
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
