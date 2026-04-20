import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Banks } from "../models/index.js";

const router = Router();

// GET /banks/search
router.get("/search", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        res.status(200).json({ banks: matchedBanks });
    } catch (err) {
        next(err);
    }
});

export default router;
