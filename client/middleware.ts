import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({
        req,
        secret: process.env.NNEXTAUTH_SECRET,
    });

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const now = Math.floor(Date.now() / 1000);

    const expNum = Number(token.exp);

    if (token.exp && expNum < now) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        const data = await res.json();

        if (!res.ok || !data.accessToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const response = NextResponse.next();

        response.cookies.set("next-auth.session-token", data.accessToken);

        return response;
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