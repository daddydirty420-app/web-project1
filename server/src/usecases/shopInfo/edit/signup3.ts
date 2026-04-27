import { AppError } from "../../../errors.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { updateShopIdPermit } from "../../../services/shopInfo/command.js";
import { getShop } from "../../../services/shopInfo/query.js";
import { ShopIdBody } from "../../../types/shopIdBody.js";
import { deleteCmdS3 } from "../../../utils/s3/deleteCmd.js";
import { generateSignedUrl } from "../../../utils/s3/signedUrl.js";

type Params = {
    shopId: number;
    userId: number;
    body: ShopIdBody;
};

// PATCH /shop-info/signup3/:id
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step3/[id]
export const updateShopSignup3UseCase = async ({ shopId, userId, body }: Params) => {
    const now = Date.now();

    const { frontFileName, frontFileType, rearFileName, rearFileType, idFrontUpload, idRearUpload, permitFiles } = body;

    // 空チェック
    if (!frontFileName || !frontFileType || !rearFileName || !rearFileType) {
        throw new AppError("INVALID_BODY", 400);
    }

    // shopInfo取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // 身分証アップロード
    let frontSignedUrl: string | null = null;
    let rearSignedUrl: string | null = null;
    let frontUrl: string | null = null;
    let rearUrl: string | null = null;
    const oldFrontUrl = shop.id_card_front || null;
    const oldRearUrl = shop.id_card_rear || null;

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

    // 古い身分証削除
    if (idFrontUpload && oldFrontUrl && frontUrl && oldFrontUrl !== frontUrl) {
        const oldFrontKey = oldFrontUrl.split(".com/")[1];

        deleteCmdS3({ key: oldFrontKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    if (idRearUpload && oldRearUrl && rearUrl && oldRearUrl !== rearUrl) {
        const oldRearKey = oldRearUrl.split(".com/")[1];

        deleteCmdS3({ key: oldRearKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    // 許認可証アップロード
    let permitSignedUrls: string[] = [];
    let permitUrls: string[] = [];
    const oldPermitUrls: string[] = Array.isArray(shop.permit_url) ? shop.permit_url : [];

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

    const filesToDelete = oldPermitUrls.filter((oldUrl) => !permitUrls.includes(oldUrl));

    for (const oldUrl of filesToDelete) {
        const oldKey = oldUrl.split(".com/")[1];

        deleteCmdS3({ key: oldKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    // db更新
    await updateShopIdPermit({
        shopInfo: shop,
        data: {
            id_card_front: frontUrl,
            id_card_rear: rearUrl,
            permit_url: permitUrls,
        },
    });

    return { frontSignedUrl, rearSignedUrl, permitSignedUrls };
};
