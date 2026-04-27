import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import sequelize from "../db.js";
import { bucket, s3, s3Domain } from "../infra/aws/s3.js";
import { authenticateToken } from "../middleware/index.js";
import { Address, BankAccount, Name, ShopInfo } from "../models/index.js";

const router = Router();

router.patch("/3/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;
    const { frontFileName, frontFileType, rearFileName, rearFileType, idFrontUpload, idRearUpload, permitFiles } =
        req.body;

    if (!frontFileName || !frontFileType || !rearFileName || !rearFileType) {
        res.status(400).json({ message: "身分証がアップロードされていない、または不正なファイルです。" });
        return;
    }

    const now = Date.now();

    try {
        const shop = await ShopInfo.findByPk(shopId);
        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        // 身分証アップロード
        let frontSignedUrl: string | null = null;
        let rearSignedUrl: string | null = null;
        let frontUrl: string | null = null;
        let rearUrl: string | null = null;
        const oldFrontUrl = shop.id_card_front || null;
        const oldRearUrl = shop.id_card_rear || null;

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

        if (idFrontUpload && oldFrontUrl && frontUrl && oldFrontUrl !== frontUrl) {
            const oldFrontKey = oldFrontUrl.split(".com/")[1];

            const deleteFrontCmd = new DeleteObjectCommand({
                Bucket: bucket,
                Key: oldFrontKey,
            });

            await s3.send(deleteFrontCmd);

            console.log(`ショップ身分証${oldFrontKey}削除`);
        }

        if (idRearUpload && oldRearUrl && rearUrl && oldRearUrl !== rearUrl) {
            const oldRearKey = oldRearUrl.split(".com/")[1];

            const deleteRearCmd = new DeleteObjectCommand({
                Bucket: bucket,
                Key: oldRearKey,
            });

            await s3.send(deleteRearCmd);

            console.log(`ショップ身分証${oldRearKey}削除`);
        }

        // 許認可証アップロード
        let permitSignedUrls: string[] = [];
        let permitUrls: string[] = [];
        const oldPermitUrls: string[] = Array.isArray(shop.permit_url) ? shop.permit_url : [];

        if (Array.isArray(permitFiles) && permitFiles.length > 0) {
            for (const file of permitFiles) {
                const { fileName, fileType, uploaded } = file;

                if (!fileName) continue;

                if (uploaded) {
                    const permitKey = `permit/${shopId}/${now}_${fileName}`;

                    const permitCommand = new PutObjectCommand({
                        Bucket: bucket,
                        Key: permitKey,
                        ContentType: fileType,
                    });

                    const signedUrl = await getSignedUrl(s3, permitCommand, { expiresIn: 60 });

                    permitSignedUrls.push(signedUrl);
                    permitUrls.push(`${s3Domain}/${permitKey}`);
                } else {
                    const oldUrl = oldPermitUrls.find((u) => decodeURIComponent(u).includes(fileName));
                    if (oldUrl) {
                        permitUrls.push(oldUrl);
                    }
                }
            }
        }

        const filesToDelete = oldPermitUrls.filter((oldUrl) => !permitUrls.includes(oldUrl));

        for (const oldUrl of filesToDelete) {
            const oldKey = oldUrl.split(".com/")[1];

            const deleteCmd = new DeleteObjectCommand({
                Bucket: bucket,
                Key: oldKey,
            });

            await s3.send(deleteCmd);
            console.log(`許認可証ファイル${oldKey}削除`);
        }

        // shopInfo更新
        await shop.update({
            id_card_front: frontUrl,
            id_card_rear: rearUrl,
            permit_url: permitUrls,
        });

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
        next(err);
    }
});

router.patch("/4/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;
    const autoTrans = req.body.autoTrans === "はい";
    const openInfo = req.body.openInfo === "はい";

    try {
        const shop = await ShopInfo.findByPk(shopId);

        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        await shop.update({
            auto_trans: autoTrans,
            open_info: openInfo,
        });

        res.status(200).json({ message: "データ更新完了" });
    } catch (err) {
        next(err);
    }
});

router.patch("/edit/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;
    const updateData = req.body;

    try {
        await ShopInfo.update(updateData, {
            where: {
                id: shopId,
            },
        });

        res.status(200).json({ message: "更新しました。", updated: updateData });
    } catch (err) {
        next(err);
    }
});

router.patch("/5/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;

    const t = await sequelize.transaction();

    try {
        const oldShops = await ShopInfo.findAll({
            where: {
                id: { [Op.ne]: shopId },
                verified: false,
                user_id: userId,
            },
            include: [{ model: Address }, { model: Name }, { model: BankAccount }],
        });

        if (oldShops.length > 0) {
            for (const oldShop of oldShops) {
                if (oldShop.Address) {
                    await oldShop.Address.destroy({ transaction: t });
                }

                if (oldShop.Name) {
                    await oldShop.Name.destroy({ transaction: t });
                }

                if (oldShop.BankAccount) {
                    await oldShop.BankAccount.destroy({ transaction: t });
                }

                await oldShop.destroy({ transaction: t });
            }
        }

        const shop = await ShopInfo.findByPk(shopId);

        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        await shop.update(
            {
                request_all: true,
            },
            { transaction: t },
        );

        // メール送信処理

        await t.commit();

        res.status(200).json({ message: "ショップ登録のリクエストが完了しました！" });
    } catch (err) {
        await t.rollback();
        next(err);
    }
});

export default router;
