import { Request, Response, NextFunction } from "express-serve-static-core";
import User from "../models/user.js";
import { AuthUser } from "./authMiddleware.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: AuthUser;
    }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            res.status(401).json({ message: "認証が必要です。" });
            return;
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "ユーザーが存在しません。" });
        }

        if (!user.admin) {
            res.status(403).json({ message: "管理者権限がありません。" });
            return;
        }

        return next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
}
