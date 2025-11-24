import axios from "axios";
import TodouhukenOption from "../models/todouhuken_option.js";

interface ZipCloudResponce {
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
    try {
        const res = await axios.get('https://zipcloud.ibsnet.co.jp/api/search', {
            params: { zipcode }
        });

        if (res.data.results && res.data.results.length > 0) {
            const result = res.data.results[0];

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