import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { editAddressUseCase } from "../usecases/address/editAddress.js";
import { getDeliveryAddressUseCase } from "../usecases/address/getDeliveryAddress.js";
import { getMyAddressUseCase } from "../usecases/address/getMyAddress.js";
import { fetchAddressFromZipUseCase } from "../usecases/address/zipUseCase.js";
import { AddressBody, addressBodySchema } from "../validators/body/address.js";
import { idParamSchema } from "../validators/params/id.js";
import { ZipcodeQuery, zipcodeQuerySchema } from "../validators/query/address.js";

const router = Router();

// PATCH /address/:id
// summary: 住所変更
// page: /edit/addressなど
router.patch(
    "/:id",
    validateParams(idParamSchema),
    validateBody(addressBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const addressId = Number(req.params.id);

        const body = req.validatedBody as AddressBody;

        const { postNumber, todouhuken, shikutyouson, banchi, building } = body;

        try {
            await editAddressUseCase({ addressId, postNumber, todouhuken, shikutyouson, banchi, building });

            res.status(200).json({ message: "住所を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /address/myaddress
// summary: 住所取得
// page: /edit/address
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
// summary: 配送用住所取得
// page: /edit/address/delivery/[id]
router.get(
    "/:id/delivery-address",
    validateParams(idParamSchema),
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
// summary: 住所検索
// page: /edit/addressなど
router.get(
    "/search",
    validateQuery(zipcodeQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const query = req.validatedQuery as ZipcodeQuery;

        const zipcode = query.zipcode;

        if (!zipcode) throw new AppError("INVALID_ZIPCODE", 400);

        try {
            const address = await fetchAddressFromZipUseCase({ zipcode });

            res.status(200).json({ address });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
