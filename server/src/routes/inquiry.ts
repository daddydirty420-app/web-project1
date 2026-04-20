import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateOptional } from "../middleware/authOptional.js";
import { createInquiryUseCase } from "../usecases/inquiry/create.js";

const router = Router();

router.post("/", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id ?? null;
    console.log("userId:", userId);
    const { name, email, title, body } = req.body;
    const emailTrim = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrim)) throw new AppError("INVALID_EMAIL", 400);

    try {
        await createInquiryUseCase({ userId, name, email, title, body });

        res.status(200).json({ message: "お問い合わせを送信しました！" });
    } catch (err) {
        next(err);
    }
});

export default router;
