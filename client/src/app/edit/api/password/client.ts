import { apiFetch } from "../../../../lib/api/client";

type Params = {
    currentPw: string;
    newPw: string;
};

export const fetchPasswordEdit = async ({ currentPw, newPw }: Params) => {
    return apiFetch("/auth/change-pw", {
        method: "PATCH",
        body: JSON.stringify({ currentPw, newPw }),
    });
};
