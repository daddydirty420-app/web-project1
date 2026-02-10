"use client";

import { useEffect } from "react";

type Props = {
    refreshToken?: string;
    rememberMe?: boolean;
};

export const CookieSet = ({ refreshToken, rememberMe }: Props) => {
    useEffect(() => {
        if (!refreshToken) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-cookie`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken, rememberMe }),
        });
    }, [refreshToken, rememberMe]);

    return null;
};