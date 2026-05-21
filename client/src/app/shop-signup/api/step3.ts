import { apiFetch } from "../../../lib/api/client";

type IdUploadBody = {
    frontFileName?: string;
    frontFileType?: string;
    rearFileName?: string;
    rearFileType?: string;
    idFrontUpload: boolean;
    idRearUpload: boolean;
    permitFiles: (
        | {
              fileName: string;
              fileType: string | null;
              uploaded: boolean;
          }
        | undefined
    )[];
};

type IdUploadResponse = {
    frontSignedUrl: string | null;
    rearSignedUrl: string | null;
    permitSignedUrls: string[];
};

export const fetchStep3 = async (shopId: string, body: IdUploadBody): Promise<IdUploadResponse> => {
    return apiFetch(`/shop-info/${shopId}/signup/3`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
