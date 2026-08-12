import rateLimit from "express-rate-limit";

export const getAddressRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

export const getNameRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
