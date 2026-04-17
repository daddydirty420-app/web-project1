import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import {
    ShopInfoEdit,
    ComOrFreeOption,
    Address,
    Name,
    TodouhukenOption,
    ShopInfo,
    BankAccount,
    AccountTypeOption,
    Notification,
} from "../models/index.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sequelize from "../db.js";

const router = Router();

const bucket = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const s3Domain = `https://${bucket}.s3.${region}.amazonaws.com`;
const s3 = new S3Client({
    region: region || "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

router.post(
    "/com-free-edit/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = req.params.id;
        const userId = req.user!.id;
        const comFreeId = Number(req.body.selectOption);

        const t = await sequelize.transaction();

        try {
            const shop = await ShopInfo.findByPk(shopId, {
                include: [
                    { model: Address },
                    {
                        model: Name,
                        as: "RepresentativeName",
                    },
                    { model: BankAccount },
                ],
            });

            if (!shop) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            if (comFreeId === Number(shop.com_or_free_id)) {
                res.status(400).json({ message: "事業形態が変更されていません。" });
                return;
            }

            const address = shop.Address;
            const name = shop.RepresentativeName;
            const bank = shop.BankAccount;

            const shopEdit = await ShopInfoEdit.create(
                {
                    company_name: shop.company_name,
                    phone_number: shop.phone_number,
                    email: shop.email,
                    open_date_time: shop.open_date_time,
                    founded_date: shop.founded_date,
                    member_count: shop.member_count,
                    homepage_url: shop.homepage_url,
                    company_number: shop.company_number,
                    captal: shop.capital,
                    user_id: userId,
                    shop_info_id: shopId,
                    com_or_free_id: comFreeId,
                },
                { transaction: t },
            );

            await Address.create(
                {
                    post_number: address.post_number,
                    todouhuken_id: address.todouhuken_id,
                    shikutyouson: address.shikutyouson,
                    banchi: address.banchi,
                    building: address.building,
                    shop_info_edit_id: shopEdit.id,
                },
                { transaction: t },
            );

            await Name.create(
                {
                    sei: name.sei,
                    mei: name.mei,
                    sei_kana: name.sei_kana,
                    mei_kana: name.mei_kana,
                    shop_info_edit_id: shopEdit.id,
                    shop_type: "representative",
                },
                { transaction: t },
            );

            await BankAccount.create(
                {
                    bank_name: bank.bank_name,
                    bank_code: bank.bank_code,
                    branch: bank.branch,
                    branch_code: bank.branch_code,
                    account_type_id: bank.account_type_id,
                    account_number: bank.account_number,
                    meigi: bank.meigi,
                    shop_info_edit_id: shopEdit.id,
                },
                { transaction: t },
            );

            await t.commit();

            res.status(200).json({ editId: shopEdit.id });
        } catch (err) {
            await t.rollback();
            next(err);
        }
    },
);

router.patch("/edit/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopEditId = req.params.id;
    const updateData = req.body;

    try {
        await ShopInfoEdit.update(updateData, {
            where: { id: shopEditId },
        });

        res.status(200).json({
            message: "更新しました。",
            updated: updateData,
        });
    } catch (err) {
        next(err);
    }
});

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

router.get(
    "/com-free/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = req.params.id;

        try {
            const shop = await ShopInfo.findByPk(shopId, {
                attributes: ["id", "com_or_free_id"],
                include: [{ model: ComOrFreeOption }],
            });

            if (!shop) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            const comFree = await ComOrFreeOption.findAll();

            res.status(200).json({ shop, comFree });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/rep-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = req.params.id;

        try {
            const data = await ShopInfoEdit.findByPk(shopEditId, {
                attributes: ["id"],
                include: [
                    {
                        model: Name,
                        attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    },
                ],
            });

            if (!data) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/con-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = req.params.id;

        try {
            const data = await ShopInfoEdit.findByPk(shopEditId, {
                attributes: ["id"],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                        include: [
                            {
                                model: Name,
                                as: "ContactName",
                                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                            },
                        ],
                    },
                ],
            });

            if (!data) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/address/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = req.params.id;

        try {
            const data = await ShopInfoEdit.findByPk(shopEditId, {
                attributes: ["id"],
                include: [
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
                ],
            });

            if (!data) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/account/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = req.params.id;

        try {
            const data = await ShopInfoEdit.findByPk(shopEditId, {
                attributes: ["id"],
                include: [
                    {
                        model: BankAccount,
                        attributes: [
                            "id",
                            "bank_name",
                            "bank_code",
                            "branch",
                            "branch_code",
                            "account_type_id",
                            "account_number",
                            "meigi",
                        ],
                        include: [{ model: AccountTypeOption }],
                    },
                ],
            });

            if (!data) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/confirm/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = req.params.id;

        try {
            const data = await ShopInfoEdit.findByPk(shopEditId, {
                include: [
                    {
                        model: Address,
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    { model: Name },
                    {
                        model: BankAccount,
                        include: [{ model: AccountTypeOption }],
                    },
                    { model: ComOrFreeOption },
                    {
                        model: ShopInfo,
                        attributes: [
                            "id",
                            "company_name",
                            "email",
                            "phone_number",
                            "homepage_url",
                            "open_date_time",
                            "company_number",
                            "capital",
                            "member_count",
                        ],
                        include: [
                            {
                                model: Address,
                                include: [
                                    {
                                        model: TodouhukenOption,
                                        as: "AddressTodouhuken",
                                    },
                                ],
                            },
                            {
                                model: Name,
                                as: "RepresentativeName",
                            },
                            {
                                model: Name,
                                as: "ContactName",
                            },
                            {
                                model: BankAccount,
                                include: [{ model: AccountTypeOption }],
                            },
                            { model: ComOrFreeOption },
                        ],
                    },
                ],
            });

            if (!data) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
