import { apiFetch } from "../../../lib/api/client";
import { Body } from "../types/uploadType";

type PresignedPost = {
    url: string;
    fields: Record<string, string>;
};

type SignedUrlWithIndex = {
    index: number;
    url: string;
};

type UploadResponse = {
    videoSignedUrl: PresignedPost | null;
    thumbnailSignedUrl: string | null;
    itemImageSignedUrls: SignedUrlWithIndex[];
    attributesImageSignedUrls: Record<string, string>;
};

export const fetchDraft = async (itemId: string, body: Body): Promise<UploadResponse> => {
    return apiFetch(`/items/${itemId}?mode=draft`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
};

export const fetchMain = async (itemId: string, body: Body): Promise<UploadResponse> => {
    return apiFetch(`/items/${itemId}?mode=main`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
};
