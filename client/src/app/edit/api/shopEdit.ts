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

type ComFreeResponse = {
    editId: number;
};

type IdUploadResponse = {
    frontSignedUrl: string | null;
    rearSignedUrl: string | null;
    permitSignedUrls: string[];
};

export const fetchCompanyNameEdit = async (shopId: string, companyName: string) => {
    return apiFetch(`/shop-info-edit/${shopId}/company-name`, {
        method: "POST",
        body: JSON.stringify({ companyName }),
    });
};

export const fetchComFreeEdit = async (shopId: string, selectOption: number): Promise<ComFreeResponse> => {
    return apiFetch(`/shop-info-edit/${shopId}/com-free`, {
        method: "POST",
        body: JSON.stringify({ selectOption }),
    });
};

export const fetchShopEditIdUpload = async (shopEditId: string, body: IdUploadBody): Promise<IdUploadResponse> => {
    return apiFetch(`/shop-info-edit/${shopEditId}/id-image-upload`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
