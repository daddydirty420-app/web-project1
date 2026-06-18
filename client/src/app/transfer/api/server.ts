import { apiFetchServer } from "../../../lib/api/server";
import { Transfer, User } from "../types";

type UserResponse = {
    user: User;
};

type TransferResponse = {
    transfer: Transfer;
};

export const fetchPointsPage = async (): Promise<UserResponse> => {
    return apiFetchServer("/user/transfer-points", {
        cache: "no-store",
    });
};

export const fetchRequestPage = async (): Promise<UserResponse> => {
    return apiFetchServer("/user/transfer-request", {
        cache: "no-store",
    });
};

export const fetchDetailPage = async (id: string): Promise<TransferResponse> => {
    return apiFetchServer(`/transfer/${id}/detail`, {
        cache: "no-store",
    });
};
