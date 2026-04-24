import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import sequelize from "../db.js";
import { bucket, s3, s3Domain } from "../infra/aws/s3.js";
import { authenticateToken } from "../middleware/index.js";
import { Notification, ShopInfo, ShopInfoEdit } from "../models/index.js";

const router = Router();

router.patch(
    "/id-image-upload/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = req.params.id;
        const userId = req.user!.id;
        const { frontFileName, frontFileType, rearFileName, rearFileType, idFrontUpload, idRearUpload, permitFiles } =
            req.body;

        if (!frontFileName || !frontFileType || !rearFileName || !rearFileType) {
            res.status(400).json({ message: "身分証がアップロードされていない、または不正なファイルです。" });
            return;
        }

        const now = Date.now();

        const t = await sequelize.transaction();

        try {
            const shopEdit = await ShopInfoEdit.findByPk(shopEditId, {
                include: [{ model: ShopInfo }],
            });
            if (!shopEdit) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            const shopId = shopEdit.ShopInfo.id;

            // 身分証アップロード
            let frontSignedUrl: string | null = null;
            let rearSignedUrl: string | null = null;
            let frontUrl: string | null = null;
            let rearUrl: string | null = null;

            if (frontFileName && idFrontUpload) {
                const frontKey = `idcard/shop/front/${shopId}/${now}_${frontFileName}`;

                const frontCommand = new PutObjectCommand({
                    Bucket: bucket,
                    Key: frontKey,
                    ContentType: frontFileType,
                });

                frontSignedUrl = await getSignedUrl(s3, frontCommand, { expiresIn: 60 });

                frontUrl = `${s3Domain}/${frontKey}`;
            }

            if (rearFileName && idRearUpload) {
                const rearKey = `idcard/shop/rear/${shopId}/${now}_${rearFileName}`;

                const rearCommand = new PutObjectCommand({
                    Bucket: bucket,
                    Key: rearKey,
                    ContentType: rearFileType,
                });

                rearSignedUrl = await getSignedUrl(s3, rearCommand, { expiresIn: 60 });

                rearUrl = `${s3Domain}/${rearKey}`;
            }

            // 許認可証アップロード
            let permitSignedUrls: string[] = [];
            let permitUrls: string[] = [];

            if (Array.isArray(permitFiles) && permitFiles.length > 0) {
                for (const file of permitFiles) {
                    const { fileName, fileType } = file;

                    if (!fileName) continue;

                    const permitKey = `permit/${shopId}/${now}_${fileName}`;

                    const permitCommand = new PutObjectCommand({
                        Bucket: bucket,
                        Key: permitKey,
                        ContentType: fileType,
                    });

                    const signedUrl = await getSignedUrl(s3, permitCommand, { expiresIn: 60 });

                    permitSignedUrls.push(signedUrl);
                    permitUrls.push(`${s3Domain}/${permitKey}`);
                }
            }

            // shopInfo更新
            await shopEdit.update(
                {
                    id_card_front: frontUrl,
                    id_card_rear: rearUrl,
                    permit_url: permitUrls,
                },
                { transaction: t },
            );

            // メール送信機能

            // お知らせ
            await Notification.create(
                {
                    read_user_id: userId,
                    message:
                        "事業形態の変更が完了しました。審査完了まで1~2週間ほどお時間を頂戴しておりますため、しばらくお待ちください。",
                },
                { transaction: t },
            );

            await t.commit();

            res.status(200).json({
                message: "身分証・許認可証のDB登録が完了しました。",
                frontSignedUrl,
                frontUrl,
                rearSignedUrl,
                rearUrl,
                permitSignedUrls,
                permitUrls,
            });
        } catch (err) {
            await t.rollback();
            next(err);
        }
    },
);

export default router;
