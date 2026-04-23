import jwt, { JwtPayload } from "jsonwebtoken";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    console.log("MIDDLEWARE FIRED:", req.url);

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // 未認証
    if (!token || !token.accessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = jwt.decode(token.accessToken as string) as JwtPayload | null;

    const now = Math.floor(Date.now() / 1000);

    const expNum = Number(decoded?.exp);

    // 期限切れの場合
    if (decoded?.exp && expNum < now) {
        // refreshTokenがない場合はログインへ
        if (!token.refreshToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: token.refreshToken }),
            });

            const data = await res.json();

            if (!res.ok || !data.accessToken) {
                console.error("Token refresh failed:", res.status);
                return NextResponse.redirect(new URL("/login", req.url));
            }

            // 新しいトークンをcookieにセット
            const response = NextResponse.next();
            response.cookies.set("access-token", data.accessToken, {
                path: "/",
                httpOnly: false, // クライアント側で読めるように
                secure: process.env.NODE_ENV === "production", // 本番環境ではsecure属性を推奨
                sameSite: "lax",
            });

            return response;
        } catch (error) {
            console.error("Token refresh error:", error);
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // トークンが有効な場合、cookieに現在のトークンをセット
    const response = NextResponse.next();
    response.cookies.set("access-token", token.accessToken as string, {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return response;
}

export const config = {
    matcher: [
        "/buy/:path*",
        "/edit/:path*",
        "/history/:path*",
        "/item/confirm/:path*",
        "/item/deleted/:path*",
        "/item/draft/:path*",
        "/item/admin/:path*",
        "/item-list/:path*",
        "/admin/:path*",
        "/money-management/:path*",
        "/my-page/:path*",
        "/notification/:path*",
        "/personal-information/:path*",
        "/profile/admin/:path*",
        "/shop-signup/:path*",
        "/transfer/:path*",
        "/upload/:path*",
    ],
};
