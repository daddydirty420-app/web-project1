import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { createAddressShop } from "../../../services/address.js";
import { createNameShop } from "../../../services/name.js";
import { createShop } from "../../../services/shopInfo/command.js";
import { fetchAddressFromZipUseCase } from "../../address/zipUseCase.js";

type Body = {
    selectOption: number | null;
    companyName: string;
    shopName: string;
    phoneNumber: string;
    email: string;
    openDateTime: string;
    foundedDate: Date;
    memberCount: number;
    homepage?: string | null;
    repSei: string;
    repMei: string;
    repSeiKana: string;
    repMeiKana: string;
    conSei: string;
    conMei: string;
    conSeiKana: string;
    conMeiKana: string;
    postNumber: string;
    todouhuken: string;
    shikutyouson: string;
    banchi: string;
    building?: string;
    companyNumber?: string;
    capital?: number;
};

type Params = {
    userId: number;
    body: Body;
};

// POST /shop-info
// summary: ShopInfo作成　事業者登録
// page: /shop-signup/step1
export const createShopSignup1 = async ({ userId, body }: Params) => {
    const {
        selectOption,
        companyName,
        shopName,
        phoneNumber,
        email,
        openDateTime,
        foundedDate,
        memberCount,
        homepage,
        repSei,
        repMei,
        repSeiKana,
        repMeiKana,
        conSei,
        conMei,
        conSeiKana,
        conMeiKana,
        postNumber,
        todouhuken,
        shikutyouson,
        banchi,
        building,
        companyNumber,
        capital,
    } = body;

    const requiredBody = [
        selectOption,
        companyName,
        shopName,
        phoneNumber,
        email,
        openDateTime,
        foundedDate,
        memberCount,
        repSei,
        repMei,
        repSeiKana,
        repMeiKana,
        conSei,
        conMei,
        conSeiKana,
        conMeiKana,
        postNumber,
        todouhuken,
        shikutyouson,
        banchi,
        ...(selectOption === 1 ? [companyNumber, capital] : []),
    ];

    if (requiredBody.some((v) => v === "" || v === undefined || v === null)) {
        throw new AppError("INVALID_BODY", 404);
    }

    // 住所バリデーションチェック
    const fromZip = await fetchAddressFromZipUseCase({ zipcode: postNumber });

    if (!fromZip) throw new AppError("INVALID_POSTNUMBER", 400);
    if (fromZip.todouhuken_name !== todouhuken) {
        throw new AppError("NOT_SAME_POSTNUMBER_TODOUHUKEN", 400);
    }
    if (fromZip.shikutyouson !== shikutyouson) {
        throw new AppError("NOT_SAME_POSTNUMBER_SHIKUTYOUSON", 400);
    }

    // db作成
    const shopId = await sequelize.transaction(async (t) => {
        const repName = await createNameShop({
            data: {
                sei: repSei,
                mei: repMei,
                sei_kana: repSeiKana,
                mei_kana: repMeiKana,
                shop_type: "representative",
            },
            transaction: t,
        });

        const conName = await createNameShop({
            data: {
                sei: conSei,
                mei: conMei,
                sei_kana: conSeiKana,
                mei_kana: conMeiKana,
                shop_type: "contact",
            },
            transaction: t,
        });

        const shop = await createShop({
            data: {
                company_name: companyName,
                shop_name: shopName,
                phone_number: phoneNumber,
                email: email,
                homepage_url: homepage ?? null,
                open_date_time: openDateTime,
                company_number: companyNumber ?? null,
                capital: capital ?? 0,
                member_count: memberCount,
                user_id: userId,
                com_or_free_id: selectOption ?? 2,
                founded_date: foundedDate,
                name_representative_id: repName.id,
                name_contact_id: conName.id,
            },
            transaction: t,
        });

        const shopId = shop.id;

        await createAddressShop({
            data: {
                post_number: postNumber,
                todouhuken_id: fromZip.todouhuken_id,
                shikutyouson,
                banchi,
                building,
                shop_info_id: shopId,
            },
            transaction: t,
        });

        return shopId;
    });

    return shopId;
};
