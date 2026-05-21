import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { outputReferenceCodeRateLimit } from "../middleware/rateLimit/referenceCodeRateLimit.js";
import { outputReferenceCodeUseCase } from "../usecases/referenceCode/output.js";

const router = Router();

// POST /reference-code/output
// summary: 紹介コード生成
// page: /my-page
router.post(
    "/output",
    authenticateToken,
    outputReferenceCodeRateLimit,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const output = await outputReferenceCodeUseCase({ userId });

            res.status(200).json({ output });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
