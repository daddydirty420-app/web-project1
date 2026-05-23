import { apiFetch, apiFetchNoToken } from "../../../../lib/api/client";

export const fetchEmailEdit = async (email: string) => {
    return apiFetch("/auth/email", {
        method: "PATCH",
        body: JSON.stringify({ email }),
    });
};

export const fetchNewEmail = async (token: string) => {
    return apiFetchNoToken(`/auth/new-email?token=${token}`, {
        method: "PATCH",
    });
};
