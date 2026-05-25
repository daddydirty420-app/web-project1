import { apiFetch } from "../../../lib/api/client";

type InquiryBody = {
    name: string;
    email: string;
    title: string;
    body: string;
};

export const fetchInquirySubmit = async (body: InquiryBody) => {
    return apiFetch("/inquiry", {
        method: "POST",
        body: JSON.stringify(body),
    });
};
