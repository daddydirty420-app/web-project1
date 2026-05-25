import { apiFetchServerNoToken } from "../../../lib/api/server";
import { User } from "../type";

type InquiryResponse = {
    user: User;
};

export const fetchInquiryPage = async (): Promise<InquiryResponse> => {
    return apiFetchServerNoToken("/user/inquiry", {
        cache: "no-store",
    });
};
