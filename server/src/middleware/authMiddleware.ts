import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthUser extends JwtPayload {
  id: number;
  email: string;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
};

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401).json({ message: "トークンがありません。" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT検証エラー:", err);
    res.status(401).json({ message: "トークンが無効です。" });
  }
};