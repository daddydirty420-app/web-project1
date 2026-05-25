import { apiFetchServer } from "../../../../lib/api/server";
import { Name } from "../../type";

type NamePageResponse = {
    data: Name;
};

export const fetchNamePage = async (): Promise<NamePageResponse> => {
    return apiFetchServer("/name/myname", {
        cache: "no-store",
    });
};
