import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Name } from "../models/index.js";

const router = Router();

router.patch(
    "/name-edit/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const nameId = req.params.id;
        const { sei, mei, seiKana, meiKana } = req.body;
        if (!sei || !mei || !seiKana || !meiKana) {
            res.status(404).json({ message: "必須項目が入力されていません。" });
            return;
        }

        try {
            await Name.update(
                {
                    sei,
                    mei,
                    sei_kana: seiKana,
                    mei_kana: meiKana,
                },
                { where: { id: nameId } },
            );

            res.status(200).json({ message: "氏名を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/delivery-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await Name.findOne({
                attributes: ["id", "sei", "mei", "sei_kana", "mei_kana", "delivery_id"],
                where: { delivery_id: req.params.id },
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get("/myname", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await Name.findOne({
            attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
            where: { user_id: req.user!.id },
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.json({ data });
    } catch (err) {
        next(err);
    }
});

export default router;
