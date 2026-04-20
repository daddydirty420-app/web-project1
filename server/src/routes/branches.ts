import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Branches } from "../models/index.js";

const router = Router();

// GET /branches/search
router.get("/search", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        res.status(200).json({ branches: matchedBranches });
    } catch (err) {
        next(err);
    }
});

export default router;
