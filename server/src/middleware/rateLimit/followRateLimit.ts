import rateLimit from "express-rate-limit";

export const addFollowRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

export const deleteFollowRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

export const followStatusRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

export const followCountRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

export const followUserListRateLimit = rateLimit({
    windowMs: 1000 * 60,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
});
