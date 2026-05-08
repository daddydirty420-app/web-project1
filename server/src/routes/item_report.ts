import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { validateParams } from "../middleware/validateParams.js";
import { getAllItemReportOptions } from "../services/itemReport.js";
import { createItemReportUseCase } from "../usecases/itemReport/create.js";
import { idParamSchema } from "../validators/params/id.js";
import { validateBody } from "../middleware/validateBody.js";
import { OptionIdBody, optionIdBodySchema } from "../validators/body/report.js";

const router = Router();

// POST /item-report/:id
// summary: item報告作成
// page: /report/item/[id]
router.post(
    "/:id",
    validateParams(idParamSchema),
    validateBody(optionIdBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as OptionIdBody;
        const optionId = body.selected;

        try {
            await createItemReportUseCase({ itemId, userId, optionId });

            res.status(200).json({ message: "報告を作成しました" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /item-report/all-options
// summary: ItemReportOptions取得
// page: /report/item/[id]
router.get("/all-options", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await getAllItemReportOptions();

        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

export default router;
