export async function refreshToken() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) return null;

        const data = await res.json();

        return data.accessToken;
    } catch (err) {
        console.error("refreshAccessToken error:", err);
        return null;
    }
};