import rateLimit from "express-rate-limit";
import { AuthUser } from "../authMiddleware.js";

export const outputReferenceCodeRateLimit = rateLimit({
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
