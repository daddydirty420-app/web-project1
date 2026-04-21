import { AppError } from "../../errors.js";
import { ZipCloudResponse } from "./type.js";

type Params = {
    zipcode: string;
};

export const fetchZipCloud = async ({ zipcode }: Params) => {
    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${encodeURIComponent(zipcode)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch(url, { signal: controller.signal });

        clearTimeout(timeout);

        if (!res.ok) {
            throw new AppError("ZIPCLOUD_FETCH_ERROR", 400);
        }

        const data = (await res.json()) as ZipCloudResponse;

        return data;
    } catch (err) {
        console.error(err);
        throw new AppError("ZIPCLOUD_FETCH_ERROR", 400);
    }
};
