import { apiFetch } from "../../../lib/api/client";

export const fetchRemoveItem = (path: string) => {
    return apiFetch(path, {
        method: "DELETE",
    });
};
