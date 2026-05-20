import { apiFetch } from "../../../lib/api/client";

type CopyUploadResponse = {
    newItemId: number;
};

export const fetchCopyUpload = async (itemId: string): Promise<CopyUploadResponse> => {
    return apiFetch(`/items/${itemId}/copy-upload`, {
        method: "POST",
    });
};
