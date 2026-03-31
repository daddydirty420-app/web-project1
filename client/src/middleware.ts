import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export async function middleware(req) {
    console.log("MIDDLEWARE FIRED:", req.url);
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = jwt.decode(token.accessToken || "") as JwtPayload | null;

    const now = Math.floor(Date.now() / 1000);

    const expNum = Number(decoded?.exp);

    let accessTokenToUse = token.accessToken;

    if (decoded?.exp && expNum < now) {
        const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        const data = await res.json();

        if (!res.ok || !data.accessToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        accessTokenToUse = data.accessToken;
    }

    const response = NextResponse.next();

    if (accessTokenToUse) {
        response.cookies.set("access-token", accessTokenToUse, { 
            path: "/" ,
            httpOnly: false,
        });
    }

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
        "/personal-infomation/:path*",
        "/profile/admin/:path*", 
        "/shop-signup/:path*", 
        "/transfer/:path*", 
        "/upload/:path*",
  ],
};