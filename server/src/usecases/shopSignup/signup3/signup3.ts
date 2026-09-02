import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { buckets } from "../../../infra/aws/s3.js";
import { uploadS3Object } from "../../../infra/aws/uploadS3Object.js";
import { createIdCard } from "../../../services/idCard.js";
import { createPermit } from "../../../services/permit.js";
import { createPermitFile } from "../../../services/permitFile.js";
import { createS3Metadata } from "../../../services/s3Metadata.js";
import { getMyShopSignupHasS3Data, updateSignup3 } from "../../../services/shopSignup.js";
import { ShopSignup3Body } from "../../../validators/body/shopSignup.js";
import { UploadedObject } from "./type.js";

type Params = {
    shopSignupId: number;
    userId: number;
    body: ShopSignup3Body;
};

// とりあえず最小構成でpermit系などnullable箇所をnullにしている
// フロントエンド構成変更によるロジック追加あり

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
            uploadedObjects.push({
                ...uploadedFront,
                type: "idCardFront",
                originalFileName: frontIdCard.fileName,
                contentType: frontIdCard.contentType,
                fileSize: frontIdCard.size,
            });
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
            uploadedObjects.push({
                ...uploadedRear,
                type: "idCardRear",
                originalFileName: rearIdCard.fileName,
                contentType: rearIdCard.contentType,
                fileSize: rearIdCard.size,
            });
        }

        const uploadedPermitFiles = [];
        let permitIndex = 0;

        for (const file of permitFiles) {
            permitIndex = permitIndex + 1;

            if (permitIndex > 10) {
                throw new AppError("OVER_MAX_PERMIT_FILE_COUNT", 400);
            }

            const permitObjectKey = `permit/${shopSignupId}/${now}_${file.fileName}`;

            const uploaded = await uploadS3Object({
                bucketName: buckets.verificationDocuments,
                objectKey: permitObjectKey,
                body: file.buffer,
                contentType: file.contentType,
            });

            uploadedPermitFiles.push(uploaded);
            uploadedObjects.push({
                ...uploaded,
                type: "permit",
                originalFileName: file.fileName,
                contentType: file.contentType,
                fileSize: file.size,
                sortOrder: permitIndex,
            });
        }

        // transaction DB更新
        await sequelize.transaction(async (t) => {
            let frontIdCardS3MetadataId: number | null = null;
            let rearIdCardS3MetadataId: number | null = null;

            const permitS3MetadataList: {
                s3MetadataId: number;
                sortOrder: number;
            }[] = [];

            for (const uploadedObject of uploadedObjects) {
                // 新S3Metadata作成
                const s3Metadata = await createS3Metadata({
                    data: {
                        bucket_name: uploadedObject.bucketName,
                        object_key: uploadedObject.objectKey,
                        version_id: uploadedObject.versionId,
                        original_file_name: uploadedObject.originalFileName,
                        content_type: uploadedObject.contentType,
                        file_size: uploadedObject.fileSize,
                        etag: uploadedObject.etag,
                    },
                    transaction: t,
                });

                if (uploadedObject.type === "idCardFront") {
                    frontIdCardS3MetadataId = s3Metadata.id;
                } else if (uploadedObject.type === "idCardRear") {
                    rearIdCardS3MetadataId = s3Metadata.id;
                } else if (uploadedObject.type === "permit") {
                    permitS3MetadataList.push({
                        s3MetadataId: s3Metadata.id,
                        sortOrder: uploadedObject.sortOrder,
                    });
                }
            }

            if (!frontIdCardS3MetadataId || !rearIdCardS3MetadataId) {
                throw new Error();
            }

            // idCard作成
            const newIdCard = await createIdCard({
                data: {
                    front_s3_metadata_id: frontIdCardS3MetadataId,
                    rear_s3_metadata_id: rearIdCardS3MetadataId,
                },
                transaction: t,
            });

            // Permit / PermitFile更新
            let newPermitId: number | null = null;

            if (permitS3MetadataList.length > 0) {
                const newPermit = await createPermit({
                    data: {
                        permit_number: null,
                        permit_type: null,
                        issued_at: null,
                        expired_at: null,
                    },
                    transaction: t,
                });

                newPermitId = newPermit.id;

                if (newPermitId) {
                    for (const permitFile of permitS3MetadataList) {
                        await createPermitFile({
                            data: {
                                permit_id: newPermitId,
                                s3_metadata_id: permitFile.s3MetadataId,
                                sort_order: permitFile.sortOrder,
                                document_name: null,
                                memo: null,
                            },
                            transaction: t,
                        });
                    }
                }
            }

            // shopSignup更新
            await updateSignup3({
                shopSignup,
                data: {
                    idcard_id: newIdCard.id,
                    permit_id: newPermitId,
                },
                transaction: t,
            });
        });

        committed = true;
    } catch (err) {
        // commit前だけ今回アップロードした新S3オブジェクトを補償削除
        if (!committed) {
        }
    }

    // commit後なので、ここから旧S3削除
};
