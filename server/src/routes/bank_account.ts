import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { Banks, Branches } from "../models/index.js";
import { editAccountUseCase } from "../usecases/bankAccount/editAccount.js";
import { getMyAccountUseCase } from "../usecases/bankAccount/getMyAccount.js";

const router = Router();

// PATCH /bank-account/:id
router.patch("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accountId = Number(req.params.id);

    const { bankName, branch, accountType, accountNumber, meigi } = req.body;

    const bankNameTrim = bankName.trim();
    const branchTrim = branch.trim();
    const accountNumberTrim = accountNumber.trim();

    if (!bankNameTrim || !branchTrim || !accountType || !accountNumberTrim || !meigi) {
        throw new AppError("INVALID_QUERY", 400, "未入力項目があります");
    }

    try {
        await editAccountUseCase({
            accountId,
            bankName: bankNameTrim,
            branch: branchTrim,
            accountType,
            accountNumber: accountNumberTrim,
            meigi,
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

        const matchedBanks = banks
            .filter((bank: typeof Banks) => {
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
            })
            .map((bank: typeof Banks) => ({
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

        const matchedBranches = branches
            .filter((b: typeof Branches) => {
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
            })
            .map((b: typeof Branches) => ({
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

// GET /bank-account/myaccount
router.get("/myaccount", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const data = await getMyAccountUseCase({ userId });

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

export default router;
