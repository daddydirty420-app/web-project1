import { Op } from "sequelize";
import { Delivery, DeliveryStatusOption, Orders } from "../../../models/index.js";

type Params = {
    page: number;
    userId: number;
    status?: string;
};

const buildOrderWhere = (userId: number, role: "buyer" | "seller", status?: string) => {
    const where: any = {
        [role === "buyer" ? "buyer_user_id" : "seller_user_id"]: userId,
    };

    if (status && ["paid", "shipped", "completed"].includes(status)) {
        where.status = status;
    } else {
        where.status = { [Op.ne]: "pending" };
    }

    return where;
};

export const getPurchasedOrders = async ({ page, userId, status }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where = buildOrderWhere(userId, "buyer", status);

    const ordersList = await Orders.findAll({
        attributes: ['id', 'total_amount', 'buy_at', 'item_count', "points_used", "status", "purchase_snapshot"],
        where,
        order: [['buy_at', 'DESC']],
        limit,
        offset,
        include: [
            {
                model: Delivery,
                attributes: ['id'],
                required: true,
                include: [
                    { model: DeliveryStatusOption },
                ],
            },
        ],
    });

    const totalCount = await Orders.count({
        where,
        include: [
            {
                model: Delivery,
                required: true,
            },
        ],
    });

    return {
        ordersList,
        totalPages: Math.ceil(totalCount / limit),
    };
};

export const getSoldOrders = async ({ page, userId, status }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where = buildOrderWhere(userId, "seller", status);

    const ordersList = await Orders.findAll({
        attributes: ['id', 'total_amount', 'buy_at', 'item_count', "status", "purchase_snapshot"],
        where,
        order: [['buy_at', 'DESC']],
        limit,
        offset,
        include: [
            {
                model: Delivery,
                attributes: ['id'],
                required: true,
                include: [
                    { model: DeliveryStatusOption },
                ],
            },
        ],
    });

    const totalCount = await Orders.count({
        where,
        include: [
            {
                model: Delivery,
                required: true,
            },
        ],
    });

    console.log("ordersList:", ordersList);
    console.log("totalCount:", totalCount);

    return {
        ordersList,
        totalPages: Math.ceil(totalCount / limit),
    };
};