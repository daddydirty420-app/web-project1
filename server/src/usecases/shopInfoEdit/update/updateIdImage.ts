import { AppError } from "../../../errors.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { createNotification } from "../../../services/notification.js";
import { UpdateShopEditIdPermit } from "../../../services/shopInfoEdit/command.js";
import { getShopEditHasShop } from "../../../services/shopInfoEdit/query.js";
import { ShopIdBody } from "../../../types/shopIdBody.js";
import { generateSignedUrl } from "../../../utils/s3/signedUrl.js";

type Params = {
    shopEditId: number;
    userId: number;
    body: ShopIdBody;
};

// PATCH /shop-info-edit/:id/id-image-upload
// summary: 事業者登録　代表者身分証アップロード
// page: edit/shop/com-free/upload/[id]
export const updateShopEditIdImageUseCase = async ({ shopEditId, userId, body }: Params) => {
    const now = Date.now();

    const { frontFileName, frontFileType, rearFileName, rearFileType, idFrontUpload, idRearUpload, permitFiles } = body;

    // 空チェック
    if (!frontFileName || !frontFileType || !rearFileName || !rearFileType) {
        throw new AppError("INVALID_BODY", 400);
    }

    // shopEdit取得
    const shopEdit = await getShopEditHasShop({ shopEditId });

    if (!shopEdit) throw new AppError("SHOP_EDIT_NOT_FOUND", 404);
    if (shopEdit.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const shopId = shopEdit.ShopInfo.id;

    // 身分証アップロード
    let frontSignedUrl: string | null = null;
    let rearSignedUrl: string | null = null;
    let frontUrl: string | null = null;
    let rearUrl: string | null = null;

    if (frontFileName && idFrontUpload) {
        const key = `idcard/shop/front/${shopId}/${now}_${frontFileName}`;

        frontSignedUrl = await generateSignedUrl({ key, contentType: frontFileType });

        frontUrl = `${s3Domain}/${key}`;
    }

    if (rearFileName && idRearUpload) {
        const key = `idcard/shop/rear/${shopId}/${now}_${rearFileName}`;

        rearSignedUrl = await generateSignedUrl({ key, contentType: rearFileType });

        rearUrl = `${s3Domain}/${key}`;
    }

    // 許認可証アップロード
    let permitSignedUrls: string[] = [];
    let permitUrls: string[] = [];

    if (Array.isArray(permitFiles) && permitFiles.length > 0) {
        for (const file of permitFiles) {
            const { fileName, fileType } = file;

            if (!fileName || !fileType) continue;

            const permitKey = `permit/${shopId}/${now}_${fileName}`;

            const signedUrl = await generateSignedUrl({ key: permitKey, contentType: fileType });

            permitSignedUrls.push(signedUrl);
            permitUrls.push(`${s3Domain}/${permitKey}`);
        }
    }

    // shopInfoEdit更新
    await UpdateShopEditIdPermit({
        shopEdit,
        data: {
            id_card_front: frontUrl,
            id_card_rear: rearUrl,
            permit_url: permitUrls,
        },
    });

    // メール送信機能

    // お知らせ作成
    createNotification({
        data: {
            read_user_id: userId,
            message:
                "事業形態の変更が完了しました。審査完了まで1~2週間ほどお時間を頂戴しておりますため、しばらくお待ちください。",
        },
    }).catch((err) => {
        console.error("service createNotification error:", err);
    });

    return { frontSignedUrl, rearSignedUrl, permitSignedUrls };
};
