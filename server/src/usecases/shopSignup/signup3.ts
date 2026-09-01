import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { buckets } from "../../infra/aws/s3.js";
import { uploadS3Object } from "../../infra/aws/uploadS3Object.js";
import { getMyShopSignupHasS3Data } from "../../services/shopSignup.js";
import { ShopSignup3Body } from "../../validators/body/shopSignup.js";

type UploadedObject = {
    bucketName: string;
    objectKey: string;
    etag: string | null;
    versionId: string | null;
};

type Params = {
    shopSignupId: number;
    userId: number;
    body: ShopSignup3Body;
};

// PATCH /shop-signup/:id/id-card
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step3/[id]
export const updateShopSignup3UseCase = async ({ shopSignupId, userId, body }: Params) => {
    const now = Date.now();

    const { frontIdCard, rearIdCard, permitFiles } = body;

    // shopSignup取得
    const shopSignup = await getMyShopSignupHasS3Data({ shopSignupId, userId });

    if (!shopSignup) throw new AppError("SHOP_SIGNUP_NOT_FOUND", 404);

    // 既存の身分証S3Metadata
    const idCard = shopSignup?.IdCard;

    const frontS3Metadata = idCard?.FrontIdCard ?? null;
    const rearS3Metadata = idCard?.RearIdCard ?? null;

    const uploadedObjects: UploadedObject[] = [];

    let committed = false;

    try {
        // 新しいファイルをアップロード
        const frontObjectKey = `idcard/front/${shopSignupId}/${now}_${frontIdCard.fileName}`;
        const rearObjectKey = `idcard/rear/${shopSignupId}/${now}_${rearIdCard.fileName}`;

        // S3へアップロード
        // frontIdCard
        const uploadedFront = frontIdCard
            ? await uploadS3Object({
                  bucketName: buckets.verificationDocuments,
                  objectKey: frontObjectKey,
                  body: frontIdCard.buffer,
                  contentType: frontIdCard.contentType,
              })
            : null;

        if (uploadedFront) {
            uploadedObjects.push(uploadedFront);
        }

        // rearIdCard
        const uploadedRear = rearIdCard
            ? await uploadS3Object({
                  bucketName: buckets.verificationDocuments,
                  objectKey: rearObjectKey,
                  body: rearIdCard.buffer,
                  contentType: rearIdCard.contentType,
              })
            : null;

        if (uploadedRear) {
            uploadedObjects.push(uploadedRear);
        }

        const uploadedPermitFiles = [];

        for (const file of permitFiles) {
            const permitObjectKey = `permit/${shopSignupId}/${now}_${file.fileName}`;

            const uploaded = await uploadS3Object({
                bucketName: buckets.verificationDocuments,
                objectKey: permitObjectKey,
                body: rearIdCard.buffer,
                contentType: rearIdCard.contentType,
            });

            uploadedPermitFiles.push(uploaded);
            uploadedObjects.push(uploaded);
        }

        // transaction DB更新
        await sequelize.transaction(async (t) => {
            // 新S3Metadata作成
            // IdCard更新
            // Permit / PermitFile更新
            // 旧S3Metadata削除
        });

        committed = true;
    } catch (err) {
        // commit前だけ新S3を補償削除
        if (!committed) {
        }
    }

    // commit後なので、ここから旧S3削除
};
