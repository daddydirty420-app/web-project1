import rateLimit from "express-rate-limit";

export const getUriagekinHistoryRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
