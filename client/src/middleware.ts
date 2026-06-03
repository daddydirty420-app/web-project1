import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { getValidAccessToken } from "./lib/refreshToken";

export async function middleware(req) {
    console.log("MIDDLEWARE FIRED:", req.url);

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.accessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const accessToken = await getValidAccessToken(token);

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

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
