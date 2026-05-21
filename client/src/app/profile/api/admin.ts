import { apiFetch } from "../../../lib/api/client";
import { User } from "../profileTypes";

type AdminProfileResponse = {
    user: User;
};

export const fetchGetAdminProfile = async (userId: string): Promise<AdminProfileResponse> => {
    return apiFetch(`/admin/user/${userId}/profile`, {
        method: "GET",
        cache: "no-store",
    });
};
