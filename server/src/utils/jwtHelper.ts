import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface JwtUserPayload extends JwtPayload {
  id: number | string;
  email: string;
};

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;
if (!NEXTAUTH_SECRET) {
  throw new Error("JWT_REFRESH_SECRETが設定されていません。");
}

export function generateAccessToken(user: { id: number | string; email: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    NEXTAUTH_SECRET,
    { expiresIn: '1h' }
  );
};

export function generateRefreshToken(user: { id: number | string; email: string }, rememberMe: boolean): string {
  const expiresIn = rememberMe ? '30d' : '3d';
  return jwt.sign(
    { id: user.id, email: user.email },
    NEXTAUTH_SECRET,
    { expiresIn }
  );
};