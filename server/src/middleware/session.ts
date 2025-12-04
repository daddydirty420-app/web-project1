import { Request, Response, NextFunction } from "express-serve-static-core";
import { v4 as uuidv4 } from "uuid";

declare module "express-serve-static-core" {
    interface Request {
        sessionId?: string;
    }
};

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
    let sessionId = req.cookies?.session_id;

    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie("session_id", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/",
        });
    }

    req.sessionId = sessionId;
    next();
};