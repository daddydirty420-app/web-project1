import { apiFetchNoToken } from "../../../lib/api/client";

type SignupResponse = {
    reissueUrl: string;
};

export const fetchSignup = async (email: string, password: string): Promise<SignupResponse> => {
    return apiFetchNoToken("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
};
