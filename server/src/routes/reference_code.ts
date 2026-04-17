import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ReferenceCode } from "../models/index.js";
import { outputReferenceCodeUseCase } from "../usecases/referenceCode/output.js";

const router = Router();

router.post("/input", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { input } = req.body;
        const currentUserId = req.user!.id;

        if (!input) {
            res.status(400).json({ message: "紹介コードがありません。" });
            return;
        }

        const newRecord = await ReferenceCode.create({
            input,
            output: null,
            input_user_id: currentUserId,
            output_user_id: null,
        });

        res.status(200).json({ newRecord });
    } catch (err) {
        next(err);
    }
});

// POST /reference-code/output
router.post("/output", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const output = await outputReferenceCodeUseCase({ userId });

        res.status(200).json({
            message: "紹介コードを生成しました。",
            output,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
