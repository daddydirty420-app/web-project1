import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export async function middleware(req) {
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