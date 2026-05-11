import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { addCartUseCase } from "../usecases/cart/add.js";
import { deleteCartUseCase } from "../usecases/cart/delete.js";
import { cartStatusUseCase } from "../usecases/cart/status.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /cart/:id
// summary: カート追加
// page: /item
router.post(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await addCartUseCase({ itemId, userId });

            res.status(200).json({ message: "カートに追加しました" });
        } catch (err) {
            next(err);
        }
    },
);

// DELETE /cart/:id
// summary: カート削除
// page: /item
router.delete(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await deleteCartUseCase({ itemId, userId });

            res.status(200).json({ message: "カートから削除しました" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /cart/:id/status
// summary: カートステータス取得
// page: /item
router.get(
    "/:id/status",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            const status = await cartStatusUseCase({ itemId, userId });

            res.status(200).json({ status });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
