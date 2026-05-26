import { apiFetchServerNoToken } from "../../../lib/api/server";
import { Res, User } from "../profileTypes";

type MetadataResponse = {
    user: User;
};

export const fetchProfileMetadata = async (userId: string): Promise<MetadataResponse> => {
    return apiFetchServerNoToken(`/user/${userId}/profile/metadata`, {
        cache: "no-store",
    });
};

export const fetchProfilePage = async (userId: string): Promise<Res> => {
    return apiFetchServerNoToken(`/user/${userId}/profile?limit=15`, {
        cache: "no-store",
    });
};
