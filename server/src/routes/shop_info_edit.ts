import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { ShopInfoEdit, ComOrFreeOption, Address, Name, TodouhukenOption, ShopInfo, User, BankAccount, Branches, Banks, AccountTypeOption } from "../models/index.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fetchAddressFromZip from "../services/addressService.js";
import sequelize from "../db.js";
import { literal, Op } from "sequelize";

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

router.patch("/phone-number-edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;
    const phoneNumber = req.body.phoneNumber;
    if (!phoneNumber) {
        res.status(400).json({ message: "電話番号がありません。" });
        return;
    }

    try {
        await ShopInfo.update({
            phone_number: phoneNumber,
        }, { where: { id: shopId }});

        await User.update({
            phone_number: phoneNumber,
        }, { where: { id: userId }});

        res.status(200).json({ message: "電話番号を更新しました。" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.post("/rep-name-edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;
    const {
        seiValue,
        meiValue,
        seiKanaValue,
        meiKanaValue,
        frontFileName,
        frontFileType,
        rearFileName,
        rearFileType,
        idFrontUpload,
        idRearUpload,
    } = req.body;

    if (!seiValue || !meiValue || !seiKanaValue || !meiKanaValue || !frontFileName || !rearFileName) {
        res.status(400).json({ message: "入力されていない項目があります。" });
        return;
    }

    const t = await sequelize.transaction();

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

        // データ作成
        const shopEdit = await ShopInfoEdit.create({
            id_card_front: frontUrl,
            id_card_rear: rearUrl,
            user_id: userId,
            shop_info_id: shopId,
        }, { transaction: t });

        await Name.create({
            sei: seiValue,
            mei: meiValue,
            sei_kana: seiKanaValue,
            mei_kana: meiKanaValue,
            shop_info_edit_id: shopEdit.id,
            shop_type: "representative",
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "代表者氏名の変更を受け付けました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.post("/address-edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;
    const {
        postNumber,
        todouhuken,
        shikutyouson,
        banchi,
        building,
    } = req.body;
    if (!postNumber || !todouhuken || !shikutyouson || !banchi) {
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

        const shopEdit = await ShopInfoEdit.create({
            user_id: userId,
            shop_info_id: shopId,
        }, { transaction: t });

        await Address.create({
            post_number: postNumber,
            todouhuken_id: todouhukenData.id,
            shikutyouson: shikutyouson,
            banchi: banchi,
            building: building,
            shop_info_edit_id: shopEdit.id,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "住所の変更を受け付けました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.post("/account-edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;
    const { bankName, branch, accountType, accountNumber, meigi } = req.body;
    if (!bankName || !branch || !accountType || !accountNumber || !meigi) {
        res.status(400).json({ message: "未入力項目があります。" });
        return;
    }

    const t = await sequelize.transaction();

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

        const shopEdit = await ShopInfoEdit.create({
            user_id: userId,
            shop_info_id: shopId,
        }, { transaction: t });

        await BankAccount.create({
            bank_code: matchedBank.code,
            bank_name: matchedBank.normalize?.name || matchedBank.name,
            branch_code: matchedBranch.code,
            branch: matchedBranch.normalize?.name || matchedBranch.name,
            account_type_id: accountTypeData.id,
            account_number: accountNumber,
            meigi: meigi,
            shop_info_edit_id: shopEdit.id,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "口座情報の変更を受け付けました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/address/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;
    
    try {
        const data = await Address.findOne({
            attributes: ["id", "post_number", "todouhuken_id", "shikutyouson", "banchi", "building"],
            where: { shop_info_id: shopId },
            include: [
                {
                    model: TodouhukenOption,
                    as: "AddressTodouhuken",
                },
            ],
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/phone-number/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;

    try {
        const data = await ShopInfo.findByPk(shopId, {
            attributes: ["id", "phone_number"],
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。"});
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/rep-name/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;

    try {
        const shop = await ShopInfo.findByPk(shopId, {
            attributes: ["id"],
            include: [
                {
                    model: Name,
                    as: "RepresentativeName",
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                }
            ]
        });

        if (!shop) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ name: shop.RepresentativeName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/account/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;

    try {
        const shop = await ShopInfo.findByPk(shopId, {
            attributes: ["id"],
            include: [
                {
                    model: BankAccount,
                    attributes: ["id", "bank_name", "branch", "account_type_id", "account_number", "meigi", "bank_code", "branch_code"],
                },
            ],
        });

        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        res.status(200).json({ data: shop.BankAccount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/con-name/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const shopId = req.params.id;

    try {
        const shop = await ShopInfo.findByPk(shopId, {
            attributes: ["id"],
            include: [
                {
                    model: Name,
                    as: "ContactName",
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                }
            ]
        });

        if (!shop) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ name: shop.ContactName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/admin/list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await ShopInfoEdit.findAll({
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: ComOrFreeOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Address,
                    attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building'],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: 'AddressTodouhuken',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: Name,
                    attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana', 'middle_name', 'middle_name_kana']
                }
            ]
        });

        if (!dataList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(dataList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;