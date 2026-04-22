import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { s3Domain } from "../../infra/aws/s3.js";
import { updateName } from "../../services/name.js";
import { getShopHasRepName, updateShop } from "../../services/shopInfo.js";
import { RepNameBody } from "../../types/repNameBody.js";
import { generateSignedUrl } from "../../utils/s3/index.js";

type Params = {
    shopId: number;
    body: RepNameBody;
};

export const updateRepNameUseCase = async ({ shopId, body }: Params) => {
    const now = Date.now();

    const {
        seiValue,
        meiValue,
        seiKanaValue,
        meiKanaValue,
        frontFileName,
        frontFileType,
        rearFileName,
        rearFileType,
        idFrontUpload,
        idRearUpload,
    } = body;

    // 空チェック
    const fields = {
        seiValue,
        meiValue,
        seiKanaValue,
        meiKanaValue,
        frontFileName,
        frontFileType,
        rearFileName,
        rearFileType,
    };

    const hasEmpty = Object.values(fields).some((v) => !v?.trim());

    if (hasEmpty) throw new AppError("INVALID_OUERY", 400);

    const sei = seiValue.trim();
    const mei = meiValue.trim();
    const seiKana = seiKanaValue.trim();
    const meiKana = meiKanaValue.trim();

    // ショップ取得
    const shop = await getShopHasRepName({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    // 身分証アップロード
    let frontSignedUrl: string | null = null;
    let rearSignedUrl: string | null = null;
    let frontUrl: string | null = null;
    let rearUrl: string | null = null;

    if (frontFileType && idFrontUpload) {
        const key = `idcard/shop/front/${shopId}/${now}_${frontFileName}`;

        frontSignedUrl = await generateSignedUrl({ key, contentType: frontFileType });

        frontUrl = `${s3Domain}/${key}`;
    }

    if (rearFileType && idRearUpload) {
        const key = `idcard/shop/rear/${shopId}/${now}_${rearFileName}`;

        rearSignedUrl = await generateSignedUrl({ key, contentType: rearFileType });

        rearUrl = `${s3Domain}/${key}`;
    }

    // データ作成
    await sequelize.transaction(async (t) => {
        await updateShop({
            shopInfo: shop,
            data: {
                id_card_front: frontUrl,
                id_card_rear: rearUrl,
            },
            transaction: t,
        });

        await updateName({
            name: shop.RepresentativeName,
            data: {
                sei: sei,
                mei: mei,
                sei_kana: seiKana,
                mei_kana: meiKana,
            },
            transaction: t,
        });
    });
};
