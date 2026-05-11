import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateOptional } from "../middleware/authOptional.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { createInquiryUseCase } from "../usecases/inquiry/create.js";
import { CreateInquiryBody, createInquiryBodySchema } from "../validators/body/inquiry.js";

const router = Router();

// POST /inquiry
// summary: お問い合わせ作成
// page: /inquiry
router.post(
    "/",
    authenticateOptional,
    validateBody(createInquiryBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id ?? null;

        const validatedBody = req.validatedBody as CreateInquiryBody;
        const { name, email, title, body } = validatedBody;

        try {
            await createInquiryUseCase({ userId, name, email, title, body });

            res.status(200).json({ message: "お問い合わせを送信しました！" });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
