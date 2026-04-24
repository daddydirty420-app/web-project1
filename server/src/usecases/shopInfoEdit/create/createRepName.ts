import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { createNameShopEdit } from "../../../services/name.js";
import { createNotification } from "../../../services/notification.js";
import { getShop } from "../../../services/shopInfo/query.js";
import { createShopEditWithIdCard } from "../../../services/shopInfoEdit/command.js";
import { RepNameBody } from "../../../types/repNameBody.js";
import { generateSignedUrl } from "../../../utils/s3/index.js";

type Params = {
    shopId: number;
    userId: number;
    body: RepNameBody;
};

export const createRepNameUseCase = async ({ shopId, userId, body }: Params) => {
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

    if (hasEmpty) throw new AppError("INVALID_QUERY", 400);

    const sei = seiValue.trim();
    const mei = meiValue.trim();
    const seiKana = seiKanaValue.trim();
    const meiKana = meiKanaValue.trim();

    // ショップ取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

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
        const shopEdit = await createShopEditWithIdCard({
            data: {
                id_card_front: frontUrl,
                id_card_rear: rearUrl,
                user_id: userId,
                shop_info_id: shopId,
            },
            transaction: t,
        });

        await createNameShopEdit({
            data: {
                sei: sei,
                mei: mei,
                sei_kana: seiKana,
                mei_kana: meiKana,
                shop_info_edit_id: shopEdit.id,
                shop_type: "representative",
            },
            transaction: t,
        });
    });

    // お知らせ作成
    createNotification({
        data: {
            read_user_id: userId,
            message:
                "代表者氏名の変更を受け付けました。審査には1~2週間程度お時間を要する場合がございます。審査完了までしばらくお待ちください。",
        },
    }).catch((err) => {
        console.error("service createNotification error:", err);
    });
};
