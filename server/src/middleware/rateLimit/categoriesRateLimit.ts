import rateLimit from "express-rate-limit";

export const getLevel2RateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
