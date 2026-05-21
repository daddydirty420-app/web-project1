import { apiFetch } from "../../../lib/api/client";

export const fetchReport = async (path: string, selected: number) => {
    return apiFetch(path, {
        method: "POST",
        body: JSON.stringify({ selected }),
    });
};
