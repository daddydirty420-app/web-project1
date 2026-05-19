import { apiFetch } from "../../../lib/api/client";

export const emailEdit = async (email: string) => {
    return apiFetch("/auth/email", {
        method: "PATCH",
        body: JSON.stringify({ email }),
    });
};
