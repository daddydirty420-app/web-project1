import type { Request, Response, NextFunction } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthUser {
    id: number;
    email: string;
    admin: boolean;
    // JWT の標準クレームも追加したい場合
    iat?: number;
    exp?: number;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    jti?: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthUser;
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        res.status(401).json({ message: 'トークンがありません。' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as AuthUser;
        req.user = decoded;

        console.log('[AUTH]', {
            userId: req.user.id,
            path: req.originalUrl,
            ip: req.ip,
        });

        next();
    } catch (err) {
        console.error('JWT検証エラー:', err);
        res.status(401).json({ message: 'トークンが無効です。' });
    }
}
