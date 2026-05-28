import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { createNameShop } from "../../../services/name.js";
import { createNotification } from "../../../services/notification.js";
import { getShop } from "../../../services/shopInfo/query.js";
import { createShopEditWithIdCard } from "../../../services/shopInfoEdit/command.js";
import { deleteCmdS3 } from "../../../utils/s3/deleteCmd.js";
import { generateSignedUrl } from "../../../utils/s3/index.js";
import { RepNameBody } from "../../../validators/body/shopInfo.js";

type Params = {
    shopId: number;
    userId: number;
    body: RepNameBody;
};

// POST /shop-info-edit/:id/rep-name
// summary: 代表者氏名データ作成
// page: /edit/name/shop/rep-name/[id]
export const createRepNameUseCase = async ({ shopId, userId, body }: Params) => {
    const now = Date.now();

    const {
        sei,
        mei,
        seiKana,
        meiKana,
        frontFileName,
        frontFileType,
        rearFileName,
        rearFileType,
        idFrontUpload,
        idRearUpload,
    } = body;

    // ショップ取得
    const shop = await getShop({ shopId });

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

    // データ作成
    await sequelize.transaction(async (t) => {
        const newRepName = await createNameShop({
            data: {
                sei,
                mei,
                sei_kana: seiKana,
                mei_kana: meiKana,
                shop_type: "representative",
            },
            transaction: t,
        });

        await createShopEditWithIdCard({
            data: {
                id_card_front: frontUrl,
                id_card_rear: rearUrl,
                user_id: userId,
                shop_info_id: shopId,
                name_representative_id: newRepName.id,
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
            type: "SHOP_EDIT",
        },
    }).catch((err) => {
        console.error("service createNotification error:", err);
    });

    return { frontSignedUrl, rearSignedUrl };
};
