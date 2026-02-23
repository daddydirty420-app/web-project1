import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Inquiry, User } from "../models/index.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/user-submit", async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const {
        name,
        email,
        title,
        body
    } = req.body;

    try {
        let user: typeof User | undefined = undefined;

        if (userId) {
            user = await User.findByPk(userId);
        }

        await Inquiry.create({
            user_id: user?.id ?? null,
            name,
            email,
            title,
            body, 
        });

        res.status(200).json({ message: "お問い合わせを送信しました！" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました" });
    }
});

router.get('/user', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'user_name', 'email'],
    });

    if (!user) {
      res.status(404).json({ message: 'データが見つかりません。' });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。'});
  }
});

export default router;