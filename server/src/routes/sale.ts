import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { validateParams } from "../middleware/validateParams.js";
import { saleEditUseCase } from "../usecases/sale/saleEdit.js";
import { saleStopUseCase } from "../usecases/sale/saleStop.js";
import { idParamSchema } from "../validators/params/id.js";
import { validateBody } from "../middleware/validateBody.js";
import { SaleEditBody, saleEditBodySchema } from "../validators/body/sale.js";

const router = Router();

// PATCH /sale/:id/edit
// summary: セール開始
// page: /item
router.patch(
    "/:id/edit",
    validateParams(idParamSchema),
    validateBody(saleEditBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const saleId = Number(req.params.id);
        const body = req.validatedBody as SaleEditBody;

        try {
            await saleEditUseCase({ saleId, body });

            res.status(200).json({ message: "値引きしました！" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /sale/:id/stop
// summary: セール終了
// page: /item
router.patch(
    "/:id/stop",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const saleId = Number(req.params.id);

        try {
            await saleStopUseCase({ saleId });

            res.status(200).json({ message: "値引きを終了しました！" });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
