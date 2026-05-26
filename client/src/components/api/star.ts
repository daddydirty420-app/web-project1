import { apiFetchNoToken } from "../../lib/api/client";

type StarResponse = {
    user: {
        star_average: number;
    };
};

export const fetchStar = async (userId: string): Promise<StarResponse> => {
    return apiFetchNoToken(`/user/${userId}/star`, {
        cache: "no-store",
    });
};
