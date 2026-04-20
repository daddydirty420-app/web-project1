import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { searchBranchesUseCase } from "../usecases/branches/search.js";

const router = Router();

// GET /branches/search?keyword=""&bankcode=""
router.get("/search", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bankCode = (req.query.bankCode as string)?.trim() ?? undefined;

    if (!bankCode) throw new AppError("INVALID_BANK_CODE", 400);

    const keyword = (req.query.keyword as string)?.trim() ?? undefined;

    const kw = keyword.toLowerCase();

    if (!kw) throw new AppError("INVALID_KEYWORD", 400);

    try {
        const matchedBranches = await searchBranchesUseCase({ kw, bankCode });

        res.status(200).json({ branches: matchedBranches });
    } catch (err) {
        next(err);
    }
});

export default router;
