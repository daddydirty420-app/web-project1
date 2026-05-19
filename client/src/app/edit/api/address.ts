import { apiFetch } from "../../../lib/api/client";

type AddressResponse = {
    address: {
        todouhuken_id: number;
        todouhuken_name: string;
        shikutyouson: string;
    };
};

export const getAddress = async (postNumber: string) => {
    const data: AddressResponse = await apiFetch(`/address/search?zipcode=${postNumber}`, {
        method: "GET",
        cache: "no-store",
    });

    return data.address;
};
