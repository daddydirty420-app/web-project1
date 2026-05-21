import { apiFetch } from "../../../lib/api/client";

type TransIdResponse = {
    transId: number;
};

export const fetchTransferRequest = async (value: number, limit: number): Promise<TransIdResponse> => {
    return apiFetch("/transfer/request", {
        method: "POST",
        body: JSON.stringify({ value, limit }),
    });
};
