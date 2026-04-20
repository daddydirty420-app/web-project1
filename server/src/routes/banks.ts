import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { searchBanksUseCase } from "../usecases/banks/search.js";

const router = Router();

// GET /banks/search
router.get("/search", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const keyword = (req.query.keyword as string)?.trim() ?? "";

    const kw = keyword.toLowerCase();

    if (!kw) throw new AppError("INVALID_KEYWORD", 400);

    try {
        const matchedBanks = await searchBanksUseCase({ kw });

        res.status(200).json({ banks: matchedBanks });
    } catch (err) {
        next(err);
    }
});

export default router;
