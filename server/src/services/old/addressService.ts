import TodouhukenOption from "../../models/todouhuken_option.js";

interface ZipCloudResponse {
    message: string | null;
    results: {
        zipcode: string;
        prefcode: string;
        address1: string;
        address2: string;
        kana1: string;
        kana2: string;
    }[] | null;
    status: number;
}

export interface AddressResult {
    todouhuken_id: number;
    todouhuken_name: string;
    shikutyouson: string;
}

async function fetchAddressFromZip(zipcode: string): Promise<AddressResult> {
    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${encodeURIComponent(zipcode)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch(url, { signal: controller.signal });

        clearTimeout(timeout);

        if (!res.ok) {
            throw new Error(`HTTPエラー: ${res.status}`);
        }

        const data = await res.json() as ZipCloudResponse;

        if (data.results && data.results.length > 0) {
            const result = data.results[0];

            const todouhuken = await TodouhukenOption.findOne({
                where: { name: result.address1 }
            });

            if (!todouhuken) {
                throw new Error("都道府県が存在しません。");
            }

            return {
                todouhuken_id: todouhuken.id,
                todouhuken_name: todouhuken.name,
                shikutyouson: result.address2,
            };
        } else {
            throw new Error("住所が見つかりません。");
        }
    } catch (err) {
        console.error("住所取得エラー：", (err as Error).message);
        throw err;
    }
}

export default fetchAddressFromZip;