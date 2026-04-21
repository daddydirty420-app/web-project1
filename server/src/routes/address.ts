import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { Address, TodouhukenOption } from "../models/index.js";
import fetchAddressFromZip from "../services/old/addressService.js";

const router = Router();

// PATCH /address/:id
router.patch("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const addressId = req.params.id;

    // 空チェック
    const fields = {
        postNumber: req.body.postNumber,
        todouhuken: req.body.todouhuken,
        shikutyouson: req.body.shikutyouson,
        banchi: req.body.banchi,
    };

    const hasEmpty = Object.values(fields).some((v) => !v?.trim());

    if (hasEmpty) throw new AppError("INVALID_OUERY", 400);

    const postNumber = req.body.postNumber.trim();
    const todouhuken = req.body.todouhuken.trim();
    const shikutyouson = req.body.shikutyouson.trim();
    const banchi = req.body.banchi.trim();
    const building = req.body.building?.trim();

    const normalizedPostNumber = postNumber.replace(/-/g, "");
    if (!/^[0-9]{7}$/.test(normalizedPostNumber)) {
        throw new AppError("INVALID_POST_NUMBER", 400);
    }

    try {
        const address = await Address.findByPk(req.params.id, {
            include: [
                {
                    model: TodouhukenOption,
                    as: "AddressTodouhuken",
                },
            ],
        });
        if (!address) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        const todouhukenData = await TodouhukenOption.findOne({
            where: {
                name: todouhuken,
            },
        });
        if (!todouhukenData || todouhukenData.id < 1 || todouhukenData.id > 47) {
            res.status(404).json({ message: "都道府県が不正な値です。" });
            return;
        }

        try {
            const fromZip = await fetchAddressFromZip(postNumber);

            if (fromZip.todouhuken_name !== todouhuken) {
                res.status(400).json({ message: "郵便番号と都道府県が一致しません。" });
                return;
            }

            if (fromZip.shikutyouson !== shikutyouson) {
                res.status(400).json({ message: "郵便番号と市区町村が一致しません。" });
                return;
            }
        } catch (err) {
            console.error("住所チェックエラー：", err);
            res.status(400).json({ message: "郵便番号が不正です。" });
            return;
        }

        await address.update({
            post_number: postNumber,
            todouhuken_id: todouhukenData.id,
            shikutyouson: shikutyouson,
            banchi: req.body.banchi,
            building: req.body.building,
        });

        res.status(200).json({ message: "住所を更新しました。" });
    } catch (err) {
        next(err);
    }
});

router.get("/myaddress", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await Address.findOne({
            attributes: ["id", "post_number", "todouhuken_id", "shikutyouson", "banchi", "building"],
            where: { user_id: req.user!.id },
            include: [
                {
                    model: TodouhukenOption,
                    as: "AddressTodouhuken",
                    required: false,
                },
            ],
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

router.get(
    "/delivery-address/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await Address.findOne({
                attributes: ["id", "post_number", "shikutyouson", "banchi", "building", "delivery_id", "user_id"],
                where: { delivery_id: req.params.id },
                include: [
                    {
                        model: TodouhukenOption,
                        as: "AddressTodouhuken",
                    },
                ],
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

router.get("/get-address", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const zipcode = req.query.zipcode as string;

    if (!zipcode) {
        res.status(400).json({ message: "郵便番号が必要です。" });
        return;
    }

    try {
        const address = await fetchAddressFromZip(zipcode);
        res.json({ address });
    } catch (err) {
        next(err);
    }
});

export default router;
