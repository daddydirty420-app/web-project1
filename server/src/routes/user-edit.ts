import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import sequelize from "../db.js";
import { bucket, region, s3 } from "../infra/aws/s3.js";
import { authenticateToken } from "../middleware/index.js";
import { Address, IdCard, Name, TodouhukenOption, User } from "../models/index.js";

const router = Router();

router.patch(
    "/honnin-submit",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const now = Date.now();
        const {
            sei,
            mei,
            seiKana,
            meiKana,
            birthday,
            postNumber,
            todouhuken,
            shikutyouson,
            banchi,
            building,
            phoneNumber,
            selectedGender,
            frontFileName,
            frontFileType,
            rearFileName,
            rearFileType,
            idFrontUpload,
            idRearUpload,
        } = req.body;
        const formattedBirthday = new Date(birthday);

        try {
            const user = await User.findByPk(userId, {
                include: [{ model: Address }, { model: Name }, { model: IdCard }],
            });
            if (!user) {
                res.status(404).json({ message: "ユーザーが見つかりません。" });
                return;
            }

            const todouhukenData = await TodouhukenOption.findOne({
                where: { name: todouhuken },
            });
            if (!todouhukenData || todouhukenData.id < 1 || todouhukenData.id > 47) {
                res.status(404).json({ message: "都道府県データが見つかりません。" });
                return;
            }
            const todouhukenId = todouhukenData.id;

            let frontSignedUrl: string | null = null;
            let rearSignedUrl: string | null = null;
            let frontUrl: string | null = null;
            let rearUrl: string | null = null;
            let oldFrontUrl = user.IdCard?.id_card_front || null;
            let oldRearUrl = user.IdCard?.id_card_rear || null;

            if (frontFileName && idFrontUpload) {
                const frontKey = `idcard/front/${userId}/${now}_${frontFileName}`;

                const frontCommand = new PutObjectCommand({
                    Bucket: bucket,
                    Key: frontKey,
                    ContentType: frontFileType,
                });

                frontSignedUrl = await getSignedUrl(s3, frontCommand, { expiresIn: 60 });

                frontUrl = `https://${bucket}.s3.${region}.amazonaws.com/${frontKey}`;
            }

            if (rearFileName && idRearUpload) {
                const rearKey = `idcard/rear/${userId}/${now}_${rearFileName}`;

                const rearCommand = new PutObjectCommand({
                    Bucket: bucket,
                    Key: rearKey,
                    ContentType: rearFileType,
                });

                rearSignedUrl = await getSignedUrl(s3, rearCommand, { expiresIn: 60 });

                rearUrl = `https://${bucket}.s3.${region}.amazonaws.com/${rearKey}`;
            }

            if (idFrontUpload && oldFrontUrl && frontUrl && frontUrl !== oldFrontUrl) {
                const oldFrontKey = oldFrontUrl.split(".com/")[1];
                const deleteFrontCmd = new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: oldFrontKey,
                });
                await s3.send(deleteFrontCmd);
                console.log(`身分証${oldFrontKey}削除`);
            }

            if (idRearUpload && oldRearUrl && rearUrl && rearUrl !== oldRearUrl) {
                const oldRearKey = oldRearUrl.split(".com/")[1];
                const deleteRearCmd = new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: oldRearKey,
                });
                await s3.send(deleteRearCmd);
                console.log(`身分証${oldRearKey}削除`);
            }

            await sequelize.transaction(async (t) => {
                if (idFrontUpload && idRearUpload) {
                    if (user.IdCard) {
                        await user.IdCard.update(
                            {
                                id_card_front: frontUrl,
                                id_card_rear: rearUrl,
                            },
                            { transaction: t },
                        );
                    } else {
                        await IdCard.create(
                            {
                                id_card_front: frontUrl,
                                id_card_rear: rearUrl,
                                user_id: userId,
                            },
                            { transaction: t },
                        );
                    }
                }

                if (user.Address) {
                    await user.Address.update(
                        {
                            post_number: postNumber,
                            todouhuken_id: todouhukenId,
                            shikutyouson: shikutyouson,
                            banchi: banchi,
                            building: building,
                        },
                        { transaction: t },
                    );
                }

                if (user.Name) {
                    await user.Name.update(
                        {
                            sei: sei,
                            mei: mei,
                            sei_kana: seiKana,
                            mei_kana: meiKana,
                        },
                        { transaction: t },
                    );
                }

                await user.update(
                    {
                        honnin_verify_request: true,
                        honnin_verified: false,
                        birthday: formattedBirthday,
                        phone_number: phoneNumber,
                        gender_id: selectedGender,
                    },
                    { transaction: t },
                );
            });

            res.status(200).json({
                message: "本人確認のリクエストが完了しました。",
                frontSignedUrl,
                rearSignedUrl,
                frontUrl,
                rearUrl,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
