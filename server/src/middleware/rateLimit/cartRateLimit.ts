import rateLimit from "express-rate-limit";

export const cartAddRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

export const cartDeleteRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

export const cartStatusRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
