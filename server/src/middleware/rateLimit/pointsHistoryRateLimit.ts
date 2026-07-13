import rateLimit from "express-rate-limit";

export const getPointsHistoryRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
