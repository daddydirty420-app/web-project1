import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { BankAccount, AccountTypeOption, Banks, Branches } from "../models/index.js";
import { Op, literal } from "sequelize";
import sequelize from "../db.js";

const router = Router();

router.post("/account-edit/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { bankName, branch, accountType, accountNumber, meigi } = req.body;
    if (!bankName || !branch || !accountType || !accountNumber || !meigi) {
        res.status(400).json({ message: "未入力項目があります。" });
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

        const account = await BankAccount.findByPk(req.params.id);
        if (!account) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        const accountTypeData = await AccountTypeOption.findOne({
            where: { name: accountType },
        });
        if (!accountTypeData) {
            res.status(400).json({ message: "口座種別が無効な値です。" });
            return;
        }

        await account.update({
            bank_code: matchedBank.code,
            bank_name: matchedBank.normalize?.name || matchedBank.name,
            branch_code: matchedBranch.code,
            branch: matchedBranch.normalize?.name || matchedBranch.name,
            account_type_id: accountTypeData.id,
            account_number: accountNumber,
            meigi: meigi,
        });

        res.status(200).json({ message: "口座情報を更新しました。" });
    } catch (err) {
        next(err);
    }
});

router.get("/search-bank-name", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const keyword = (req.query.keyword as string)?.trim() ?? "";
    if (!keyword) {
        res.status(400).json({ message: "銀行名を1文字以上入力してください。" });
        return;
    }

    const kw = keyword.toLowerCase();
    
    try {
        const banks = await Banks.findAll();
        
        const matchedBanks = banks.filter((bank: typeof Banks) => {
            const name = (bank.name || "").toLowerCase();
            const kana = (bank.kana || "").toLowerCase();
            const hira = (bank.hira || "").toLowerCase();
            const nName = (bank.normalize?.name || "").toLowerCase();
            const nKana = (bank.normalize?.kana || "").toLowerCase();
            const nHira = (bank.normalize?.hira || "").toLowerCase();

            return (
                name.includes(kw) ||
                kana.includes(kw) ||
                hira.includes(kw) ||
                nName.includes(kw) ||
                nKana.includes(kw) ||
                nHira.includes(kw)
            );
        }).map((bank: typeof Banks) => ({
            code: bank.code,
            name: bank.normalize?.name || bank.name,
            kana: bank.kana,
            hira: bank.hira,
        }));

        res.json({ banks: matchedBanks });
    } catch (err) {
        next(err);
    }
});

router.get("/search-branch", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bankCode = req.query.bankCode as string;

    const keywordParam = req.query.keyword;
    const keyword = typeof keywordParam === "string" ? keywordParam.trim() : "";
    if (!bankCode || !keyword) {
        res.status(400).json({ message: "銀行コードと支店名を指定してください。" });
        return;
    }

    const kw = keyword.toLowerCase();

    try {
        const branches = await Branches.findAll({
            where: { bank_code: bankCode },
        });

        const matchedBranches = branches.filter((b: typeof Branches) => {
            const name = (b.name || "").toLowerCase();
            const kana = (b.kana || "").toLowerCase();
            const hira = (b.hira || "").toLowerCase();
            const nName = (b.normalize?.name || "").toLowerCase();
            const nKana = (b.normalize?.kana || "").toLowerCase();
            const nHira = (b.normalize?.hira || "").toLowerCase();

            return (
                name.includes(kw) ||
                kana.includes(kw) ||
                hira.includes(kw) ||
                nName.includes(kw) ||
                nKana.includes(kw) ||
                nHira.includes(kw)
            );
        }).map((b: typeof Branches) => ({
            code: b.code,
            name: b.normalize?.name || b.name,
            kana: b.kana,
            hira: b.hira,
        }));


        res.json({ branches: matchedBranches });
    } catch (err) {
        next(err);
    }
});

router.get('/myaccount', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await BankAccount.findOne({
            attributes: ['id', 'bank_name', 'branch', 'account_type_id', 'account_number', 'meigi', 'bank_code', 'branch_code'],
            where: { user_id: req.user!.id },
            include: [
                { model: AccountTypeOption },
            ],
        });

        if (!data) {
            res.status(404).json({ message: '口座情報が見つかりません。' });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

export default router;