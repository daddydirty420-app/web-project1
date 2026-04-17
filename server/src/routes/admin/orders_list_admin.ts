import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Op } from "sequelize";
import { Orders, Item, Delivery, DeliveryStatusOption, User } from "../../models/index.js";
import { subDays } from "date-fns";

const router = Router();

router.get(
    "/30",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const thirtyDaysAgo = subDays(new Date(), 30);

        try {
            const dataList = await Orders.findAll({
                attributes: ["id", "gain_amount", "buy_at"],
                where: {
                    cancel: false,
                    buy_date: { [Op.lt]: thirtyDaysAgo },
                },
                order: [["buy_at", "ASC"]],
                include: [
                    {
                        model: Item,
                        attributes: ["id", "name"],
                    },
                    {
                        model: User,
                        as: "Seller",
                        attributes: ["id", "user_name", "email"],
                    },
                    {
                        model: User,
                        as: "Buyer",
                        attributes: ["id", "user_name", "email"],
                    },
                    {
                        model: Delivery,
                        required: true,
                        attributes: ["id"],
                        where: {
                            delivery_status_id: { [Op.ne]: 4 },
                        },
                        include: [{ model: DeliveryStatusOption }],
                    },
                ],
            });

            res.json({ dataList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
