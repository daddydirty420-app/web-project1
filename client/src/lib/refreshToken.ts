"use client";

export async function refreshTokenIfNeeded() {
    try {
        const accessToken = getCookie("next-auth.session-token");
        const exp = Number(getCookie("next-auth.session-exp"));

        if (!accessToken || !exp) return null;

        const now = Math.floor(Date.now() / 1000);

        if (exp > now) {
            return accessToken;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok || !data.accessToken) {
            deleteCookie("next-auth.session-token");
            deleteCookie("next-auth.session-exp");
            return null;
        }

        setCookie("next-auth.session-token", data.accessToken);
        setCookie("next-auth.session-exp", data.exp);

        return data.accessToken;
    } catch (err) {
        console.error("refreshAccessTokenIfNeeded error:", err);
        return null;
    }
};

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
};

function setCookie(name: string, value: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${value}; path=/;`;
}

function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; max-age=0;`;
}