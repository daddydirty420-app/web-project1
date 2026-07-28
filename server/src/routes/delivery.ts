import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op, Sequelize } from "sequelize";
import { authenticateToken } from "../middleware/index.js";
import { createDeliveryRateLimit, getAddressRateLimit } from "../middleware/rateLimit/deliveryRateLiimit.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import {
    Address,
    Delivery,
    Item,
    Name,
    Orders,
    ShippingDayOption,
    ShippingServiceOption,
    TodouhukenOption,
} from "../models/index.js";
import { postDeliveryBuyUseCase } from "../usecases/delivery/postBuy.js";
import { idParamSchema } from "../validators/params/id.js";
import { getDeliveryAddressUseCase } from "../usecases/delivery/getDeliveryAddress.js";

const router = Router();

// POST /delivery/:id
// summary: 配送データ作成
// page: /item
router.post(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    createDeliveryRateLimit,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const itemId = Number(req.params.id);

        try {
            const deliveryId = await postDeliveryBuyUseCase({ itemId, userId });

            res.status(200).json({ deliveryId });
        } catch (err) {
            next(err);
        }
    },
);

// GET /delivery/:id/address
// summary: 配送用住所取得
// page: /edit/address/delivery/[id]
router.get(
    "/:id/address",
    getAddressRateLimit,
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

router.get(
    "/index-wait-item-list",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const currentUserId = req.user!.id;

            const data = await Delivery.findAll({
                attributes: ["id"],
                where: { buyer_user_id: currentUserId, cancel: false, delivery_status_id: { [Op.ne]: 4 } },
                order: [["buy_date", "DESC"]],
                include: [
                    {
                        model: Item,
                        attributes: ["id", "name", [Sequelize.literal(`"Item"."image_url"[1]`), "first_image_url"]],
                    },
                    {
                        model: Orders,
                        attributes: ["id"],
                    },
                ],
            });

            res.json({ data });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/buy-trans/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await Delivery.findByPk(req.params.id, {
                attributes: ["id", "buyer_phone_number"],
                include: [
                    {
                        model: Address,
                        attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: Name,
                        attributes: ["sei", "mei"],
                    },
                    { model: ShippingDayOption },
                    { model: ShippingServiceOption },
                    {
                        model: TodouhukenOption,
                        as: "DeliveryTodouhuken",
                    },
                    {
                        model: Item,
                        attributes: [
                            "id",
                            "name",
                            "price",
                            "stock_now",
                            [Sequelize.literal(`"Item"."image_url"[1]`), "first_image_url"],
                        ],
                    },
                ],
            });

            res.json({ data });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
