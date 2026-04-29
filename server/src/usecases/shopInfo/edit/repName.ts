import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { updateName } from "../../../services/name.js";
import { updateShopIdCard } from "../../../services/shopInfo/command.js";
import { getShopHasRepName } from "../../../services/shopInfo/query.js";
import { RepNameBody } from "../../../types/repNameBody.js";
import { deleteCmdS3 } from "../../../utils/s3/deleteCmd.js";
import { generateSignedUrl } from "../../../utils/s3/index.js";

type Params = {
    shopId: number;
    body: RepNameBody;
    userId: number;
};

// PATCH /shop-info/:id/rep-name
// summary 代表者氏名変更
// page: /edit/name/shop/rep-name/signup/[id]
export const updateRepNameUseCase = async ({ shopId, body, userId }: Params) => {
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
    };

    const hasEmpty = Object.values(fields).some((v) => !v?.trim());

    if (hasEmpty) throw new AppError("INVALID_BODY", 400);

    const sei = seiValue.trim();
    const mei = meiValue.trim();
    const seiKana = seiKanaValue.trim();
    const meiKana = meiKanaValue.trim();

    // ショップ取得
    const shop = await getShopHasRepName({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // 身分証アップロード
    let frontSignedUrl: string | null = null;
    let rearSignedUrl: string | null = null;
    let frontUrl: string | null = shop.id_card_front ?? null;
    let rearUrl: string | null = shop.id_card_rear ?? null;

    if (frontFileType && idFrontUpload) {
        const key = `idcard/shop/front/${shopId}/${now}_${frontFileName}`;

        frontSignedUrl = await generateSignedUrl({ key, contentType: frontFileType });

        frontUrl = `${s3Domain}/${key}`;
    }

    if (!frontUrl) throw new AppError("FRONT_URL_EMPTY", 400);

    if (rearFileType && idRearUpload) {
        const key = `idcard/shop/rear/${shopId}/${now}_${rearFileName}`;

        rearSignedUrl = await generateSignedUrl({ key, contentType: rearFileType });

        rearUrl = `${s3Domain}/${key}`;
    }

    if (!rearUrl) throw new AppError("REAR_URL_EMPTY", 400);

    // 旧身分証削除
    if (shop.id_card_front && idFrontUpload) {
        const oldFrontKey = shop.id_card_front.split(".com/")[1];

        deleteCmdS3({ key: oldFrontKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    if (shop.id_card_rear && idRearUpload) {
        const oldRearKey = shop.id_card_rear.split(".com/")[1];

        deleteCmdS3({ key: oldRearKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    // データ更新
    await sequelize.transaction(async (t) => {
        await updateShopIdCard({
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

    return { frontSignedUrl, rearSignedUrl };
};
