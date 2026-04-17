import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthUser } from "./authMiddleware.js";

dotenv.config();

declare module "express-serve-static-core" {
    interface Request {
        user?: AuthUser;
    }
}

export function authenticateOptional(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        req.user = undefined;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string, {
            ignoreExpiration: true,
        }) as AuthUser;
        req.user = decoded;
        console.log("[AUTH.optional]", {
            userId: req.user.id,
            path: req.originalUrl,
            ip: req.ip,
        });
    } catch (err) {
        console.warn("JWT検証エラー（authenticateOptional）:", err);
        req.user = undefined;
    }

    next();
}
