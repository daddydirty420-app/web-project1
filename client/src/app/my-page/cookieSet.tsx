"use client";

import { useEffect } from "react";
import { fetchCookieSet } from "./api/auth";

type Props = {
    refreshToken?: string;
    rememberMe?: boolean;
};

export const CookieSet = ({ refreshToken, rememberMe }: Props) => {
    useEffect(() => {
        if (!refreshToken) return;

        fetchCookieSet({ refreshToken, rememberMe });
    }, [refreshToken, rememberMe]);

    return null;
};
