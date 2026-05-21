import { apiFetchNoToken } from "../../../lib/api/client";

type ReissueResponse = {
    reissueUrl: string;
};

export const fetchSignup = async (email: string, password: string): Promise<ReissueResponse> => {
    return apiFetchNoToken("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
};

export const fetchResend = async (token: string): Promise<ReissueResponse> => {
    return apiFetchNoToken("/auth/resend-verification-code", {
        method: "POST",
        body: JSON.stringify({ token }),
    });
};
