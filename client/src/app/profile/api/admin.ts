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

export const fetchAddPenalty = async (userId: string, addPenalty: number): Promise<AdminProfileResponse> => {
    return apiFetch(`/admin/user/${userId}/add-penalty`, {
        method: "PATCH",
        body: JSON.stringify({ addPenalty }),
    });
};

export const fetchUriageDecrease = async (userId: string, deleteUriage: number): Promise<AdminProfileResponse> => {
    return apiFetch(`/admin/user/${userId}/delete-uriage`, {
        method: "PATCH",
        body: JSON.stringify({ deleteUriage }),
    });
};

export const fetchDeleteUser = async (userId: string, deleteReason: string): Promise<AdminProfileResponse> => {
    return apiFetch(`/admin/user/${userId}`, {
        method: "DELETE",
        body: JSON.stringify({ deleteReason }),
    });
};
