import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { Name } from "../models/index.js";
import { editNameUseCase } from "../usecases/name/editName.js";

const router = Router();

// PATCH /name/:id
router.patch("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const nameId = Number(req.params.id);

    // 空チェック
    const fields = {
        sei: req.body.sei,
        mei: req.body.mei,
        seiKana: req.body.seiKana,
        meiKana: req.body.meiKana,
    };

    const hasEmpty = Object.values(fields).some((v) => !v?.trim());

    if (hasEmpty) throw new AppError("INVALID_OUERY", 400);

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
});

// GET /name/myname
router.get("/myname", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const data = await Name.findOne({
            attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            where: { user_id: req.user!.id },
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

// GET /name/delivery-name/:id
router.get(
    "/delivery-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const deliveryId = Number(req.params.id);

        try {
            const data = await Name.findOne({
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana", "delivery_id"],
                where: { delivery_id: req.params.id },
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
