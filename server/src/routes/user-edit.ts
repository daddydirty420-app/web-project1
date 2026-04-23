import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import sequelize from "../db.js";
import { bucket, region, s3 } from "../infra/aws/s3.js";
import { authenticateToken } from "../middleware/index.js";
import { Address, GenderOption, IdCard, Name, ShopInfo, TodouhukenOption, User } from "../models/index.js";

const router = Router();

router.patch(
    "/profile-update",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const fileName = req.body.fileName || null;
        const contentType = req.body.contentType;
        const imageEdit = req.query.imageEdit === "true";

        try {
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: ShopInfo,
                        where: { verified: true },
                        required: false,
                    },
                ],
            });
            if (!user) {
                res.status(404).json({ message: "ユーザーが見つかりません。" });
                return;
            }

            let signedUrl: string | null = null;
            let imageUrl: string | null = null;
            let oldImageUrl = user.profile_image;

            if (fileName) {
                const Key = `profile-image/${userId}/${Date.now()}_${fileName}`;

                const command = new PutObjectCommand({
                    Bucket: bucket,
                    Key: Key,
                    ContentType: contentType,
                });

                signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

                imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${Key}`;
            }

            const updateData: any = {
                user_name: req.body.userName,
                user_introduction: req.body.introduction,
            };

            if (imageEdit) {
                updateData.profile_image = imageUrl || null;
            }

            await user.update(updateData);

            const hasShop = !!user.ShopInfo;

            if (hasShop) {
                await user.ShopInfo.update({
                    shop_name: req.body.userName,
                });
            }

            if ((!fileName && imageEdit) || (imageUrl && oldImageUrl && imageUrl !== oldImageUrl)) {
                const oldKey = oldImageUrl.split(".com/")[1];
                const deleteCmd = new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: oldKey,
                });
                await s3.send(deleteCmd);
                console.log(`${oldKey}削除`);
            }

            res.status(200).json({
                message: "プロフィール更新完了！",
                signedUrl,
                imageUrl,
            });
        } catch (err) {
            next(err);
        }
    },
);

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

router.get("/honnin", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await User.findByPk(req.user!.id, {
            attributes: ["id", "birthday", "phone_number", "gender_id"],
            include: [
                { model: GenderOption },
                {
                    model: Address,
                    attributes: ["id", "post_number", "todouhuken_id", "shikutyouson", "banchi", "building"],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: "AddressTodouhuken",
                        },
                    ],
                },
                {
                    model: Name,
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                },
                {
                    model: IdCard,
                    attributes: ["id", "id_card_front", "id_card_rear"],
                },
            ],
        });

        const genderAllOptions = await GenderOption.findAll();

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.json({
            data,
            genderAllOptions,
        });
    } catch (err) {
        next(err);
    }
});

router.get(
    "/profile-edit",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = await User.findByPk(req.user!.id, {
                attributes: ["id", "user_name", "user_introduction", "profile_image"],
            });

            if (!userData) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json({ userData });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
