"use client";

import { jwtDecode } from "jwt-decode";

export async function getAccessToken() {
    const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access-token="));
    
    const accessToken = match ? match.split("=")[1] : null;

    if (!accessToken) {
        return await refreshAccessToken();
    }

    try {
        const decoded = jwtDecode<{ exp: number }>(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decoded.exp <= currentTime) {
            console.log("Token expired, refreshing...");
            return await refreshAccessToken();
        }
        
        return accessToken;
    } catch (err) {
        console.error("Failed to decode token:", err);
        return await refreshAccessToken();
    }
};

async function refreshAccessToken() {
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