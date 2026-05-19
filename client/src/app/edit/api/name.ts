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

export const nameEdit = async (nameId: string, body: NameEditBody) => {
    return apiFetch(`/name/${nameId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};

export const shopEditRepNameCreate = async (shopId: string, body: ShopRepNameBody): Promise<RepNameShopResponse> => {
    return apiFetch(`/shop-info-edit/${shopId}/rep-name`, {
        method: "POST",
        body: JSON.stringify(body),
    });
};

export const shopRepNamePatch = async (shopId: string, body: ShopRepNameBody): Promise<RepNameShopResponse> => {
    return apiFetch(`/shop-info/${shopId}/rep-name`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
