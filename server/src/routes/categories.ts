import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { getLevel2UseCase } from "../usecases/categories/getLevel2.js";

const router = Router();

// GET /categories/:id/level2
// summary: カテゴリーlevel2取得
// page: /upload
router.get("/:id/level2", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parentId = Number(req.params.id);

    try {
        const category2 = await getLevel2UseCase({ parentId });

        res.status(200).json({ category2 });
    } catch (err) {
        next(err);
    }
});

export default router;
