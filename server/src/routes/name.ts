import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Name } from "../models/index.js";

const router = Router();

router.patch("/name-edit/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const name = await Name.findByPk(req.params.id);
        if (!name) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        await name.update({
            sei: req.body.sei,
            mei: req.body.mei,
            sei_kana: req.body.seiKana,
            mei_kana: req.body.meiKana,
        });

        res.status(200).json({ message: "氏名を更新しました。" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/delivery-name/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Name.findOne({
            attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana', 'delivery_id'],
            where: { delivery_id: req.params.id },
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/myname', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Name.findOne({
            attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana'],
            where: { user_id: req.user!.id }
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;