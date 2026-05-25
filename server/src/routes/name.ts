import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { getNameRateLimit, nameEditRateLimit } from "../middleware/rateLimit/nameRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { editNameUseCase } from "../usecases/name/editName.js";
import { getDeliveryNameUseCase } from "../usecases/name/getDeliveryName.js";
import { getMyNameUseCase } from "../usecases/name/getMyName.js";
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

        const body = req.validatedBody as NameBody;
        const { sei, mei, seiKana, meiKana } = body;

        try {
            await editNameUseCase({ nameId, sei, mei, seiKana, meiKana });

            res.status(200).json({ message: "氏名を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /name/myname
// summary: 自分の氏名取得
// page: /edit/nameなど
router.get(
    "/myname",
    getNameRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const name = await getMyNameUseCase({ userId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    },
);

// GET /name/:id/delivery-name
// summary: 配送用氏名取得
// page: /edit/name/delivery/[id]
router.get(
    "/:id/delivery-name",
    getNameRateLimit,
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const deliveryId = Number(req.params.id);

        try {
            const name = await getDeliveryNameUseCase({ deliveryId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
