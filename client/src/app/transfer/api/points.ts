import { apiFetch } from "../../../lib/api/client";

export const fetchTransferPoints = async (value: number, limit: number) => {
    return apiFetch("/transfer/points", {
        method: "POST",
        body: JSON.stringify({ value, limit }),
    });
};
