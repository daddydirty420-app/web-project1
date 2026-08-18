import { apiFetch } from "../../../lib/api/client";

type Body = {
    selectOption: number | null;
    companyName?: string;
    shopName: string;
    phoneNumber: string;
    email: string;
    openDateTime?: string;
    foundedDate?: Date;
    memberCount: number;
    homepage?: string | null;
    repSei?: string;
    repMei?: string;
    repSeiKana?: string;
    repMeiKana?: string;
    conSei?: string;
    conMei?: string;
    conSeiKana?: string;
    conMeiKana?: string;
    postNumber?: string;
    todouhuken?: string;
    shikutyouson?: string;
    banchi?: string;
    building?: string;
    companyNumber?: string;
    capital?: number;
};

type AddressResponse = {
    address: {
        todouhuken_id: number;
        todouhuken_name: string;
        shikutyouson: string;
        banchi: string;
    };
};

type ShopSignupIdResponse = {
    shopSignupId: number;
};

export const fetchGetAddress = async (postNumber: string) => {
    const data: AddressResponse = await apiFetch(`/address/search?zipcode=${postNumber}`, {
        method: "GET",
        cache: "no-store",
    });

    return data.address;
};

export const fetchStep1 = async (body: Body): Promise<ShopSignupIdResponse> => {
    return apiFetch("/shop-signup", {
        method: "POST",
        body: JSON.stringify(body),
    });
};
