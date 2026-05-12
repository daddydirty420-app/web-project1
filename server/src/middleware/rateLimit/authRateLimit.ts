import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../../infra/redis/redis.js";

export const authRateLimit = rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 10,

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});
