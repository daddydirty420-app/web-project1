import type { NextFunction, Request, Response } from "express-serve-static-core";

import { AppError } from "../errors.js";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new AppError("NOT_FOUND", 404, "リソースが見つかりません"));
};
