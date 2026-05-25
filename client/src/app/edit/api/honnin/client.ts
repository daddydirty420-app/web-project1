import { apiFetch } from "../../../../lib/api/client";

type HonninBody = {
    sei?: string;
    mei?: string;
    seiKana?: string;
    meiKana?: string;
    birthday: Date | null;
    postNumber?: string;
    todouhuken?: string;
    shikutyouson?: string;
    banchi?: string;
    building?: string;
    phoneNumber: string;
    selectedGender?: number;
    frontFileName?: string;
    frontFileType?: string;
    rearFileName?: string;
    rearFileType?: string;
    idFrontUpload: boolean;
    idRearUpload: boolean;
};

type HonninResponse = {
    frontSignedUrl: string | null;
    rearSignedUrl: string | null;
};

export const fetchHonninSubmit = async (body: HonninBody): Promise<HonninResponse> => {
    return apiFetch("/user/honnin", {
        method: "PATCH",
        body: JSON.stringify(body),
    });
};
