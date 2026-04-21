import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { Address, TodouhukenOption } from "../models/index.js";
import { editAddressUseCase } from "../usecases/address/editAddress.js";
import { fetchAddressFromZipUseCase } from "../usecases/address/zipUseCase.js";
import { getMyAddressUseCase } from "../usecases/address/getMyAddress.js";

const router = Router();

// PATCH /address/:id
router.patch("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const addressId = Number(req.params.id);

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
        await editAddressUseCase({ addressId, postNumber, todouhuken, shikutyouson, banchi, building });

        res.status(200).json({ message: "住所を更新しました。" });
    } catch (err) {
        next(err);
    }
});

// GET /address/myaddress
router.get("/myaddress", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const data = await getMyAddressUseCase({ userId });

        res.status(200).json({ data });
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

            res.status(200).json({ data });
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
        const address = await fetchAddressFromZipUseCase({ zipcode });

        res.status(200).json({ address });
    } catch (err) {
        next(err);
    }
});

export default router;
