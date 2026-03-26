import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ReferenceCode, Item } from "../models/index.js";

const router = Router();

router.post('/input', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { input } = req.body;
        const currentUserId = req.user!.id;

        if (!input) {
            res.status(400).json({ message: '紹介コードがありません。' });
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

function generateRandomReferenceCode(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

router.post('/output', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const output = generateRandomReferenceCode();

        await ReferenceCode.create({
            output: output,
            output_user_id: req.user!.id,
        });

        res.status(200).json({
            message: '紹介コードを生成しました。',
            output,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/my-page/count', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const itemCount = await Item.count({
            where: { seller_id: userId },
        });

        const referenceCount = await ReferenceCode.count({
            where: {
                output_user_id: userId,
                checked: true,
            },
        });

        res.status(200).json({
            itemCount,
            referenceCount
        });
    } catch (err) {
        next(err);
    }
});

export default router;