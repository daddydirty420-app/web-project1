import { apiFetchNoAuth } from "../../../lib/api/client";

export const fetchResetPw = async (token: string, password: string) => {
    return apiFetchNoAuth("/auth/reset-pw", {
        method: "POST",
        body: JSON.stringify({ token, password }),
    });
};

export const fetchRequestResetPw = async (email: string) => {
    return apiFetchNoAuth("/auth/request-password-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
};
