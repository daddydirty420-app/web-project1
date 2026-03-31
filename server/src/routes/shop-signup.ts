import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ShopInfo, ComOrFreeOption, Address, Name, TodouhukenOption, BankAccount, AccountTypeOption, User } from "../models/index.js";

const router = Router();

router.get('/signup1', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
                    required: false,
                },
                {
                    model: Address,
                    attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: "AddressTodouhuken",
                            required: false,
                        },
                    ],
                    required: false,
                },
                {
                    model: Name,
                    as: "RepresentativeName",
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    required: false,
                },
                {
                    model: Name,
                    as: "ContactName",
                    attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    required: false,
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

        res.status(200).json({ shopData, userData, comOrFree });
    } catch (err) {
        next(err);
    }
});

router.get("/signup2/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const shopId = req.params.id;

    try {
        let data = await BankAccount.findOne({
            attributes: ['id', 'bank_name', 'branch', 'account_type_id', 'account_number', 'meigi', 'bank_code', 'branch_code'],
            where: { shop_info_id: shopId },
            include: [
                { model: AccountTypeOption },
            ],
        });

        if (!data) {
            data = await BankAccount.findOne({
                attributes: ['id', 'bank_name', 'branch', 'account_type_id', 'account_number', 'meigi', 'bank_code', 'branch_code'],
                where: { user_id: userId },
                include: [
                    { model: AccountTypeOption },
                ],
            });
        }

        if (!data) {
            res.status(404).json({ message: "口座情報が見つかりません。" });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

router.get('/signup3/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ['id', 'id_card_front', 'id_card_rear', 'permit_url']
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

router.get('/signup5/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;

    try {
        const data = await ShopInfo.findByPk(shopId, {
            attributes: ["id", "company_name", "shop_name", "phone_number", "email", "open_date_time", "founded_date", "member_count", "homepage_url", "company_number", "capital", "auto_trans", "open_info"],
            include: [
                {
                    model: ComOrFreeOption,
                },
                {
                    model: Name,
                    as: "RepresentativeName",
                    attributes: ["sei", "mei", "sei_kana", "mei_kana"],
                },
                {
                    model: Name,
                    as: "ContactName",
                    attributes: ["sei", "mei", "sei_kana", "mei_kana"],
                },
                {
                    model: Address,
                    attributes: ["post_number", "shikutyouson", "banchi", "building"],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: "AddressTodouhuken",
                        },
                    ],
                },
                {
                    model: BankAccount,
                    attributes: ["bank_name", "branch_code", "account_number", "meigi"],
                    include: [
                        { model: AccountTypeOption },
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
});

export default router;