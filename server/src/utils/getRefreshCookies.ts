export const getRefreshTokenCookieOptions = (rememberMe: boolean) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".fuckintesting.com" : undefined,
    maxAge: rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 3 * 24 * 60 * 60 * 1000,
});