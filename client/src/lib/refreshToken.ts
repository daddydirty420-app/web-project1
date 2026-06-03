import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

export async function getValidAccessToken(token: JWT): Promise<string | null> {
    const decoded = jwt.decode(token.accessToken as string) as JwtPayload | null;
    const now = Math.floor(Date.now() / 1000);
    const isExpired = decoded?.exp && Number(decoded.exp) < now;

    if (!isExpired) return token.accessToken as string;

    if (!token.refreshToken) return null;

    try {
        const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });
        const data = await res.json();
        return res.ok && data.accessToken ? data.accessToken : null;
    } catch {
        return null;
    }
}