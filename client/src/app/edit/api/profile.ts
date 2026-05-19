import { apiFetch } from "../../../lib/api/client";

type ProfileBody = {
    fileName?: string;
    contentType?: string;
    userName: string;
    introduction: string;
};

type ProfileEditResponse = {
    signedUrl: string | null;
};

export const profileEdit = async (query: string, body: ProfileBody): Promise<ProfileEditResponse> => {
    return apiFetch(`/user/profile${query}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
