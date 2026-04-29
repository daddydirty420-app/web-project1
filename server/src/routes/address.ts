import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { editAddressUseCase } from "../usecases/address/editAddress.js";
import { getDeliveryAddressUseCase } from "../usecases/address/getDeliveryAddress.js";
import { getMyAddressUseCase } from "../usecases/address/getMyAddress.js";
import { fetchAddressFromZipUseCase } from "../usecases/address/zipUseCase.js";

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

    if (hasEmpty) throw new AppError("INVALID_QUERY", 400);

    const postNumber = req.body.postNumber.trim();
    const todouhuken = req.body.todouhuken.trim();
    const shikutyouson = req.body.shikutyouson.trim();
    const banchi = req.body.banchi.trim();
    const building = req.body.building?.trim();

    // 郵便番号正規化バリデーションチェック
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

// GET /address/:id/delivery-address
router.get(
    "/:id/delivery-address",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const deliveryId = Number(req.params.id);

        try {
            const data = await getDeliveryAddressUseCase({ deliveryId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

// GET /address/search
router.get("/search", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const zipcode = req.query.zipcode as string;

    if (!zipcode) throw new AppError("INVALID_ZIPCODE", 400);

    try {
        const address = await fetchAddressFromZipUseCase({ zipcode });

        res.status(200).json({ address });
    } catch (err) {
        next(err);
    }
});

export default router;
