import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../infra/redis/redis.js";

export const loginRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

export const signupRateLimit = rateLimit({
    windowMs: 1000 * 60 * 60,
    limit: 7,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

export const resendVerifyCodeRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

export const signupVerifyRateLimit = rateLimit({
    windowMs: 1000 * 60 * 10,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

export const pwResetRequestRateLimit = rateLimit({
    windowMs: 1000 * 60 * 60,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

export const pwResetRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

export const emailChangeRequestRateLimit = rateLimit({
    windowMs: 1000 * 60 * 60,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

export const emailChangeRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});
