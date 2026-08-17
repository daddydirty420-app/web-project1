import type { Request, Response } from "express-serve-static-core";

import { AppError } from "../errors.js";

export const errorHandler = (err: unknown, req: Request, res: Response) => {
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
};
