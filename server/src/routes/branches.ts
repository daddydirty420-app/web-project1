import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { validateQuery } from "../middleware/validateQuery.js";
import { searchBranchesUseCase } from "../usecases/branches/search.js";
import { BranchSearchQuery, branchSearchQuerySchema } from "../validators/query/branches.js";

const router = Router();

// GET /branches/search?keyword=""&bankcode=""
// summary: 支店名検索
// page: /edit/accountなど
router.get(
    "/search",
    validateQuery(branchSearchQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const query = req.validatedQuery as BranchSearchQuery;

        const { bankCode, keyword } = query;

        try {
            const matchedBranches = await searchBranchesUseCase({ kw: keyword, bankCode });

            res.status(200).json({ branches: matchedBranches });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
