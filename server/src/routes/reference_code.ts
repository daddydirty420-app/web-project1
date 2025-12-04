import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ReferenceCode, Item } from "../models/index.js";

const router = Router();

router.get('/my-page/count', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    try {
        const itemCount = await Item.count({
            where: { seller_id: userId }
        });

        const referenceCount = await ReferenceCode.count({
            where: {
                output_user_id: userId,
                checked: true
            }
        });

        res.status(200).json({
            itemCount,
            referenceCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.post('/input', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
            output_user_id: null
        });

        res.status(200).json(newRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
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

router.post('/output', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;