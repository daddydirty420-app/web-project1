import { apiFetch } from "../../../lib/api/client";

type OutputResponse = {
    output: string;
};

export const fetchCodeOutput = async (): Promise<OutputResponse> => {
    return apiFetch("/reference-code/output", {
        method: "POST",
    });
};
