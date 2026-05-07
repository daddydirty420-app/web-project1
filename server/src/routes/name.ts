import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { validateParams } from "../middleware/validateParams.js";
import { editNameUseCase } from "../usecases/name/editName.js";
import { getDeliveryNameUseCase } from "../usecases/name/getDeliveryName.js";
import { getMyNameUseCase } from "../usecases/name/getMyName.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// PATCH /name/:id
router.patch(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const nameId = Number(req.params.id);

        // 空チェック
        const fields = {
            sei: req.body.sei,
            mei: req.body.mei,
            seiKana: req.body.seiKana,
            meiKana: req.body.meiKana,
        };

        const hasEmpty = Object.values(fields).some((v) => !v?.trim());

        if (hasEmpty) throw new AppError("INVALID_QUERY", 400);

        const sei = req.body.sei.trim();
        const mei = req.body.mei.trim();
        const seiKana = req.body.seiKana.trim();
        const meiKana = req.body.meiKana.trim();

        try {
            await editNameUseCase({ nameId, sei, mei, seiKana, meiKana });

            res.status(200).json({ message: "氏名を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /name/myname
router.get("/myname", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const data = await getMyNameUseCase({ userId });

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

// GET /name/:id/delivery-name
router.get(
    "/:id/delivery-name",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const deliveryId = Number(req.params.id);

        try {
            const data = await getDeliveryNameUseCase({ deliveryId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
