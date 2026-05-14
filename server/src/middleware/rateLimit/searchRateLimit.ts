import rateLimit from "express-rate-limit";

export const getSearchHistoryRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
});
