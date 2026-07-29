import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { nameEditRateLimit } from "../middleware/rateLimit/nameRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { editNameUseCase } from "../usecases/name/editName.js";
import { NameBody, nameBodySchema } from "../validators/body/name.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// PATCH /name/:id
// summary: 氏名変更
// page: /edit/name
router.patch(
    "/:id",
    authenticateToken,
    nameEditRateLimit,
    validateParams(idParamSchema),
    validateBody(nameBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const nameId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as NameBody;
        const { sei, mei, seiKana, meiKana } = body;

        try {
            await editNameUseCase({ nameId, userId, sei, mei, seiKana, meiKana });

            res.status(200).json({ message: "氏名を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
