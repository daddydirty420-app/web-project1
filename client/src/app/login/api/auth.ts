import { apiFetchNoAuth } from "../../../lib/api/client";

export const fetchResetPw = async (token: string, password: string) => {
    return apiFetchNoAuth("/auth/reset-pw", {
        method: "POST",
        body: JSON.stringify({ token, password }),
    });
};
