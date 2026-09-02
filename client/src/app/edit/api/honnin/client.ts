import { ApiError } from "../../../../lib/api/apiError";
import { getAccessToken } from "../../../../lib/getAccessToken";

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
    phoneNumber?: string;
    selectedGender?: number;
    frontIdCard?: File;
    rearIdCard?: File;
};

export const fetchHonninSubmit = async (body: HonninBody): Promise<void> => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new ApiError("UNAUTHORIZED");
    }

    const formData = new FormData();

    formData.append("sei", body.sei ?? "");
    formData.append("mei", body.mei ?? "");
    formData.append("seiKana", body.seiKana ?? "");
    formData.append("meiKana", body.meiKana ?? "");
    formData.append("birthday", body.birthday?.toISOString() ?? "");
    formData.append("postNumber", body.postNumber ?? "");
    formData.append("todouhuken", body.todouhuken ?? "");
    formData.append("shikutyouson", body.shikutyouson ?? "");
    formData.append("banchi", body.banchi ?? "");
    formData.append("building", body.building ?? "");
    formData.append("phoneNumber", body.phoneNumber ?? "");
    formData.append("selectedGender", String(body.selectedGender ?? ""));
    formData.append("idFrontUpload", String(body.frontIdCard instanceof File));
    formData.append("idRearUpload", String(body.rearIdCard instanceof File));

    if (body.frontIdCard) formData.append("frontIdCard", body.frontIdCard);
    if (body.rearIdCard) formData.append("rearIdCard", body.rearIdCard);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/honnin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json();
        throw new ApiError(data.code ?? "API Error");
    }
};
