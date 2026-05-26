import { apiFetchServer } from "../../../lib/api/server";
import { User } from "../types";

type UserResponse = {
    user: User;
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
