export const getRefreshTokenCookieOptions = (rememberMe: boolean) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000,
});

export const getClearAccessTokenCookieOptions = () => ({
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
});

export const getClearRefreshTokenCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
});
