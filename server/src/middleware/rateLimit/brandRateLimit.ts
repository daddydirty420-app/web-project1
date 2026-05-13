import rateLimit from "express-rate-limit";

export const brandSuggestRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
});
