import { apiFetch } from "../../../lib/api/client";

type NameEditBody = {
    sei: string;
    mei: string;
    seiKana: string;
    meiKana: string;
};

type ShopRepNameBody = {
    sei: string;
    mei: string;
    seiKana: string;
    meiKana: string;
    frontFileName?: string;
    frontFileType?: string;
    rearFileName?: string;
    rearFileType?: string;
    idFrontUpload: boolean;
    idRearUpload: boolean;
};

type RepNameShopResponse = {
    frontSignedUrl: string;
    rearSignedUrl: string;
};

export const fetchNameEdit = async (nameId: string, body: NameEditBody) => {
    return apiFetch(`/name/${nameId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};

export const fetchShopEditRepNameCreate = async (
    shopId: string,
    body: ShopRepNameBody,
): Promise<RepNameShopResponse> => {
    return apiFetch(`/shop-info-edit/${shopId}/rep-name`, {
        method: "POST",
        body: JSON.stringify(body),
    });
};

export const fetchShopRepNamePatch = async (shopId: string, body: ShopRepNameBody): Promise<RepNameShopResponse> => {
    return apiFetch(`/shop-info/${shopId}/rep-name`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
