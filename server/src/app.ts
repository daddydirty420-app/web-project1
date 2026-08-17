import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import helmet from "helmet";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { startAllCrons } from "./cron/index.js";
startAllCrons();

const app = express();

import { AppError } from "./errors.js";
import { registerRoutes } from "./routes/index.js";

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("trust proxy", 1);

const allowedOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URL_PROD, process.env.CLIENT_URL_DEV];

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked: ${origin}`));
            }
        },
        credentials: true,
    }),
);

app.use(express.static(path.join(__dirname, "public")));

registerRoutes(app);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError("NOT_FOUND", 404, "リソースが見つかりません"));
});

// error handler
app.use((err: any, req: Request, res: Response) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            code: err.code,
            message: err.publicMessage ?? err.code,
        });
    }

    res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "サーバーエラーが発生しました",
    });
});

export default app;
