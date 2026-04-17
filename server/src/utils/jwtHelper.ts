import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface JwtUserPayload {
    id: number | string;
    email: string;
    iat?: number;
    exp?: number;
    type?: string;
}

const rawSecret = process.env.NEXTAUTH_SECRET;

if (!rawSecret) {
    throw new Error("JWT_SECRETが設定されていません。");
}

const NEXTAUTH_SECRET: string = rawSecret;

export function generateAccessToken(user: { id: number | string; email: string }): string {
    const payload: JwtUserPayload = { id: user.id, email: user.email, type: "access" };
    return jwt.sign(payload, NEXTAUTH_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(user: { id: number | string; email: string }, rememberMe: boolean): string {
    const payload: JwtUserPayload = { id: user.id, email: user.email, type: "refresh" };
    return jwt.sign(payload, NEXTAUTH_SECRET, { expiresIn: rememberMe ? "30d" : "3d" });
}
