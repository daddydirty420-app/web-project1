import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { editTypeUseCase } from "../../usecases/notification/test/editType.js";

const router = Router();

router.patch("/type", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const useCase = new editTypeUseCase();

        await useCase.execute();

        res.status(200).json({ message: "type変更完了" });
    } catch (err) {
        next(err);
    }
});

export default router;
