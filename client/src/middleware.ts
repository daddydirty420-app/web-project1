import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export async function middleware(req) {
    console.log("🔥 MIDDLEWARE FIRED:", req.url);
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

    console.log("🔍 token.exp:", decoded?.exp);
    console.log("🔍 now:", now);
    console.log("🔍 exp - now =", expNum - now);
    console.log("token.accessToken:", token.accessToken);
    console.log("token.refreshToken:", token.refreshToken);

    if (decoded?.exp && expNum < now) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        const data = await res.json();

        console.log("refreshData:", data);

        if (!res.ok || !data.accessToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/session?update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accessToken: data.accessToken
            }),
        });

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/buy/:path*", 
        "/edit/:path*", 
        "/history/:path*", 
        "/item/confirm/:path*",
        "/item/deleted/:path*",
        "/item/draft/:path*",
        "/item/madmax/:path*",
        "/item-list/:path*", 
        "/madmax/:path*", 
        "/money-management/:path*", 
        "/my-page/:path*", 
        "/notification/:path*", 
        "/personal-infomation/:path*",
        "/profile/madmax/:path*", 
        "/reccomend/:path*", 
        "/shop-signup/:path*", 
        "/transfar/:path*", 
        "/upload/:path*",
  ],
};