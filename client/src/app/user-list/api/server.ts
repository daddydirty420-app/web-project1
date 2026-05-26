import { apiFetchServerNoToken } from "../../../lib/api/server";

type FollowCountResponse = {
    followCount: number;
    followerCount: number;
};

export const fetchFollowCount = async (userId: string): Promise<FollowCountResponse> => {
    return apiFetchServerNoToken(`/follow/${userId}/count`, {
        cache: "no-store",
    });
};
