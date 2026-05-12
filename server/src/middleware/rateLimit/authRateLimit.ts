import rateLimit from "express-rate-limit";

export const loginRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,
});

export const signupRateLimit = rateLimit({
    windowMs: 1000 * 60 * 60,
    limit: 7,
    standardHeaders: true,
    legacyHeaders: false,
});

export const resendVerifyCodeRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

export const signupVerifyRateLimit = rateLimit({
    windowMs: 1000 * 60 * 10,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

export const pwResetRequestRateLimit = rateLimit({
    windowMs: 1000 * 60 * 60,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
});

export const pwResetRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

export const emailChangeRequestRateLimit = rateLimit({
    windowMs: 1000 * 60 * 60,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
});

export const emailChangeRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
});
