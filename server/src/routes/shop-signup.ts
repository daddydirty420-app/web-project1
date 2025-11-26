import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/index.js";
import { ShopInfo, ComOrFreeOption, Address, Name, TodouhukenOption, BankAccount, AccountTypeOption, User, Banks, Branches } from "../models/index.js";
import sequelize from "../db.js";
import fetchAddressFromZip from "../services/addressService.js";
import { literal, Op } from "sequelize";

const router = Router();

router.post("/signup1-create", authenticateToken, async (req: Request, res: Response): Promise<void> => {
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

router.post("/signup2-create/id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
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

router.get('/signup1', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const shopId = req.query?.shopId ?? null;
    try {
        const data = await User.findByPk(userId, {
            attributes: ["id", "user_name", "email", "phone_number"],
            include: [
                {
                    model: Address,
                    attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: "AddressTodouhuken",
                            attributes: ["id", "name"],
                        },
                    ],
                },
                {
                    model: Name,
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                },
            ],
        });

        if (!data) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }

        let shopData = null;
        if (shopId) {
            const shopData = await ShopInfo.findByPk(shopId, {
                attributes: ['id', 'company_name', 'shop_name', 'email', 'phone_number', 'homepage_url', 'open_date_time', 'company_number', 'capital', 'menber_count', 'founded_date'],
                include: [
                    {
                        model: ComOrFreeOption,
                        attributes: ['id', 'name']
                    },
                ]
            });

            if (!shopData) {
                res.status(404).json({ message: 'データが見つかりません。' });
                return;
            }
        }

        const comOrFree = await ComOrFreeOption.findAll();
        if (!comOrFree) {
            res.status(404).json({ message: "データが見つかりません。" });
            console.error("comOrFreeOption not found!!!");
            return;
        }

        res.json({ data, shopData, comOrFree });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get("/signup2/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const shopId = req.params.id;

    try {
        let data = await BankAccount.findOne({
            attributes: ['id', 'bank_name', 'branch', 'account_type_id', 'account_number', 'meigi', 'bank_code', 'branch_code'],
            where: { shop_info_id: shopId },
            include: [
                {
                    model: AccountTypeOption,
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!data) {
            data = await BankAccount.findOne({
                attributes: ['id', 'bank_name', 'branch', 'account_type_id', 'account_number', 'meigi', 'bank_code', 'branch_code'],
                where: { user_id: userId },
                include: [
                    {
                        model: AccountTypeOption,
                        attributes: ['id', 'name'],
                    },
                ],
            });
        }

        if (!data) {
            res.status(404).json({ message: "口座情報が見つかりません。" });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/signup3/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'id_card_front', 'id_card_rear', 'permit_url']
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/upload-permit-list/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const imageList = await ShopInfo.findByPk(req.params.id, {
            attributes: ['permit_url']
        });

        if (!imageList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(imageList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/signup4/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id'],
            include: [
                {
                    model: BankAccount,
                    attributes: ['id', 'bank_name', 'branch_code', 'account_number', 'meigi'],
                    include: [
                        {
                            model: AccountTypeOption,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;