import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken } from "../middleware/index.js";
import { getOrderListRateLimit } from "../middleware/rateLimit/ordersRateLimit.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { validateQuery } from "../middleware/validate/validateQuery.js";
import {
    Address,
    Cancel,
    Categories,
    Chat,
    Delivery,
    DeliveryStatusOption,
    Item,
    Name,
    Orders,
    PaymentMethodOption,
    Sale,
    ShippingDayOption,
    ShippingServiceOption,
    ShopInfo,
    TodouhukenOption,
    User,
} from "../models/index.js";
import { getPurchasedListUseCase } from "../usecases/orders/getPurchasedList.js";
import { getSoldListUseCase } from "../usecases/orders/getSoldList.js";
import { idParamSchema } from "../validators/params/id.js";
import { getOrderListQuerySchema, OrderListQuery } from "../validators/query/orders.js";

const router = Router();

// /orders?type="purchased"&page=number&status=""
// summary: 購入・販売履歴取得
// page: type=purchased: /order/list/purchased
// page: type=sold: /order/list/sold
router.get(
    "/",
    getOrderListRateLimit,
    authenticateToken,
    validateQuery(getOrderListQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const query = req.validatedQuery as OrderListQuery;
        const { type, page, status } = query;

        const params = { page, userId, status };

        const usecase = type === "purchased" ? () => getPurchasedListUseCase(params) : () => getSoldListUseCase(params);

        try {
            const { ordersList, totalPages } = await usecase();

            res.status(200).json({ ordersList, totalPages });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
