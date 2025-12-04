import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ShopInfo, ComOrFreeOption, Address, Name, TodouhukenOption, BankAccount, AccountTypeOption, User, ReccomendMonth } from "../models/index.js";

const router = Router();

router.get('/signup1', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    try {
        const shopData = await ShopInfo.findOne({
            where: {
                user_id: userId,
                request_all: false,
            },
            order: [["createdAt", "DESC"]],
            attributes: ['id', 'company_name', 'shop_name', 'email', 'phone_number', 'homepage_url', 'open_date_time', 'company_number', 'capital', 'member_count', 'founded_date'],
            include: [
                {
                    model: ComOrFreeOption,
                    attributes: ['id', 'name'],
                    require: false,
                },
                {
                    model: Address,
                    attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: "AddressTodouhuken",
                            attributes: ["id", "name"],
                            require: false,
                        },
                    ],
                    require: false,
                },
                {
                    model: Name,
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    require: false,
                },
            ],
            require: false,
        });

        const userData = await User.findByPk(userId, {
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

        if (!userData) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }

        const comOrFree = await ComOrFreeOption.findAll();
        if (!comOrFree) {
            res.status(404).json({ message: "データが見つかりません。" });
            console.error("comOrFreeOption not found!!!");
            return;
        }

        res.json({ shopData, userData, comOrFree });
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

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get("/signup4/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.user!.id, {
            include: [
                { model: ReccomendMonth }
            ]
        });

        const hasReccomend = !!user.ReccomendMonth;

        res.status(200).json({ hasReccomend });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/signup5/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;