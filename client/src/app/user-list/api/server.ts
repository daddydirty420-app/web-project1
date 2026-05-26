import { apiFetchServerNoAuth } from "../../../lib/api/server";

type FollowCountResponse = {
    followCount: number;
    followerCount: number;
};

export const fetchFollowCount = async (userId: string): Promise<FollowCountResponse> => {
    return apiFetchServerNoAuth(`/follow/${userId}/count`, {
        cache: "no-store",
    });
};
