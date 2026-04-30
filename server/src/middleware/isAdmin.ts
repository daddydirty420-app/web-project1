import { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { getUser } from "../services/users/query.js";
import { AuthUser } from "./authMiddleware.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: AuthUser;
    }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new AppError("INVALID_USER", 401);

        const userId = req.user.id;

        const user = await getUser({ userId });

        if (!user) throw new AppError("USER_NOT_FOUND", 404);

        if (!user.admin) throw new AppError("INVALID_ADMIN_USER", 403);

        return next();
    } catch (err) {
        next(err);
    }
}
