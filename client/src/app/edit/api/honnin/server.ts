import { apiFetchServer } from "../../../../lib/api/server";
import { GenderOption, User } from "../../type";

type HonninResponse = {
    user: User;
    genderAllOptions: GenderOption[];
};

export const fetchHonninPage = async (): Promise<HonninResponse> => {
    return apiFetchServer("/user/honnin", {
        cache: "no-store",
    });
};
