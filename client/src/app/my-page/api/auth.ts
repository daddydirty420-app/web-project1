import { apiFetchNoToken } from "../../../lib/api/client";

type Params = {
    refreshToken: string;
    rememberMe?: boolean;
};

export const fetchCookieSet = async ({ refreshToken, rememberMe }: Params) => {
    return apiFetchNoToken("/auth/set-cookie", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ refreshToken, rememberMe }),
    });
};

export const fetchCookieClear = async () => {
    return apiFetchNoToken("/auth/clear-cookie", {
        method: "POST",
        credentials: "include",
    });
};
