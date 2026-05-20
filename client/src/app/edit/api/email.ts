import { apiFetch } from "../../../lib/api/client";

export const fetchEmailEdit = async (email: string) => {
    return apiFetch("/auth/email", {
        method: "PATCH",
        body: JSON.stringify({ email }),
    });
};
