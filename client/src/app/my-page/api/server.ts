import { apiFetchServer } from "../../../lib/api/server";
import { Res } from "../types";

export const fetchMyPage = async (): Promise<Res> => {
    return apiFetchServer("/user/my-page", {
        cache: "no-store",
    });
};
