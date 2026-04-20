import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Inquiry, User } from "../models/index.js";

const router = Router();

router.post("/user-submit", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.query.userId;
    const { name, email, title, body } = req.body;

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
        next(err);
    }
});

export default router;
