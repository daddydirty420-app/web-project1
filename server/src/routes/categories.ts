import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { getLevel2RateLimit } from "../middleware/rateLimit/categoriesRateLimit.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { getLevel2UseCase } from "../usecases/categories/getLevel2.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// GET /categories/:id/level2
// summary: カテゴリーlevel2取得
// page: /upload
router.get(
    "/:id/level2",
    getLevel2RateLimit,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const parentId = Number(req.params.id);

        try {
            const category2 = await getLevel2UseCase({ parentId });

            res.status(200).json({ category2 });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
