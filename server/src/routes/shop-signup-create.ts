import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ShopInfo, Address, Name, TodouhukenOption, BankAccount, AccountTypeOption, Banks, Branches } from "../models/index.js";
import sequelize from "../db.js";
import fetchAddressFromZip from "../services/addressService.js";
import { literal, Op } from "sequelize";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

const now = Date.now();

router.post("/1", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const {
        selectOption,
        companyName,
        shopName,
        phoneNumber,
        email,
        openDateTime,
        foundedDate,
        memberCount,
        homepage,
        sei,
        mei,
        seiKana,
        meiKana,
        postNumber,
        todouhuken,
        shikutyouson,
        banchi,
        building,
        companyNumber,
        capital,
    } = req.body;

    const requiredBody = [
        selectOption,
        companyName,
        shopName,
        phoneNumber,
        email,
        openDateTime,
        foundedDate,
        memberCount,
        sei,
        mei,
        seiKana,
        meiKana,
        postNumber,
        todouhuken,
        shikutyouson,
        banchi,
        ...(selectOption === 1 ? [companyNumber, capital] : []),
    ];

    if (requiredBody.some(v => v === "" || v === undefined || v === null)) {
        res.status(400).json({ message: "必須項目が未入力です。" });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const todouhukenData = await TodouhukenOption.findOne({
            where: {
                name: todouhuken,
            },
        });
        if (!todouhukenData || (todouhukenData.id < 1 || todouhukenData.id > 47)) {
            res.status(404).json({ message: "都道府県が不正な値です。" });
            return;
        }

        try {
            const fromZip = await fetchAddressFromZip(postNumber);

            if (fromZip.todouhuken_name !== todouhuken) {
                res.status(400).json({ message: "郵便番号と都道府県が一致しません。" });
                return;
            }

            if (fromZip.shikutyouson !== shikutyouson) {
                res.status(400).json({ message: "郵便番号と市区町村が一致しません。" });
                return;
            }
        } catch (err) {
            console.error("住所チェックエラー：", err);
            res.status(400).json({ message: "郵便番号が不正です。" });
            return;
        }

        const data = await ShopInfo.create({
            company_name: companyName,
            shop_name: shopName,
            phone_number: phoneNumber,
            email: email,
            homepage_url: homepage,
            open_date_time: openDateTime,
            company_number: companyNumber,
            capital,
            member_count: memberCount,
            user_id: userId,
            com_or_free_id: selectOption,
            founded_date: foundedDate,
        }, { transaction: t });

        await Address.create({
            post_number: postNumber,
            todouhuken_id: todouhukenData.id,
            shikutyouson,
            banchi,
            building,
            shop_info_id: data.id,
        }, { transaction: t });

        await Name.create({
            sei,
            mei,
            sei_kana: seiKana,
            mei_kana: meiKana,
            shop_info_id: data.id,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ id: data.id });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.patch("/2/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const { bankName, branch, accountType, accountNumber, meigi } = req.body;
    if (!bankName || !branch || !accountType || !accountNumber || !meigi) {
        res.status(400).json({ message: "入力されていない項目があります。" });
        return;
    }

    try {
        const matchedBank = await Banks.findOne({
            where: {
                [Op.or]: [
                    { name: bankName },
                    sequelize.where(literal(`LOWER(normalize->>'name')`), bankName.toLowerCase()),
                    sequelize.where(literal(`LOWER(normalize->>'kana')`), bankName.toLowerCase()),
                    sequelize.where(literal(`LOWER(normalize->>'hira')`), bankName.toLowerCase()),
                ],
            },
        });
        if (!matchedBank) {
            res.status(400).json({ message: "指定された銀行名が存在しません。" });
            return;
        }

        const matchedBranch = await Branches.findOne({
            where: {
                bank_code: matchedBank.code,
                [Op.or]: [
                    { name: branch },
                    sequelize.where(literal(`LOWER(normalize->>'name')`), branch.toLowerCase()),
                    sequelize.where(literal(`LOWER(normalize->>'kana')`), branch.toLowerCase()),
                    sequelize.where(literal(`LOWER(normalize->>'hira')`), branch.toLowerCase()),
                ],
            },
        });
        if (!matchedBranch) {
            res.status(400).json({ message: "指定された支店名が存在しません。" });
            return;
        }

        const accountTypeData = await AccountTypeOption.findOne({
            where: { name: accountType },
        });
        if (!accountTypeData) {
            res.status(400).json({ message: "口座種別が無効な値です。" });
            return;
        }

        await BankAccount.upsert({
            shop_info_id: shopId,
            bank_code: matchedBank.code,
            bank_name: matchedBank.normalize?.name || matchedBank.name,
            branch_code: matchedBranch.code,
            branch: matchedBranch.normalize?.name || matchedBranch.name,
            account_type_id: accountTypeData.id,
            account_number: accountNumber,
            meigi: meigi,
        });

        res.status(200).json({ message: "口座情報を登録しました。" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.patch("/3/:id", authenticateToken, async (req: Request, res: Response) : Promise<void> => {
    const shopId = req.params.id;
    const {
        frontFileName,
        frontFileType,
        rearFileName,
        rearFileType,
        idFrontUpload,
        idRearUpload,
        permitFiles,
    } = req.body;

    if (!frontFileName || !frontFileType || !rearFileName || !rearFileType) {
        res.status(400).json({ message: "身分証がアップロードされていない、または不正なファイルです。" });
        return;
    }

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
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.patch("/4/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const autoTrans = req.body.autoTrans === "はい";
    const openInfo = req.body.openInfo === "はい";
    const reccomend = req.body.reccomend === "はい";

    try {
        const shop = await ShopInfo.findByPk(shopId);

        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        await shop.update({
            auto_trans: autoTrans,
            open_info: openInfo,
            reccomend: reccomend,
        });

        res.status(200).json({ message: "データ更新完了" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.patch("/edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.patch("/5/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;

    try {
        await ShopInfo.destroy({
            where: {
                id: { [Op.ne]: shopId },
                verified: false,
                user_id: userId,
            },
        });

        const shop = await ShopInfo.findByPk(shopId);

        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        await shop.update({
            request_all: true,
        });

        res.status(200).json({ message: "ショップ登録のリクエストが完了しました！" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

export default router;