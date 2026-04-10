import { Delivery, DeliveryStatusOption, Orders } from "../models/index.js";
import { OrderListParams } from "../types/serviceType/orders.js";

export const getPurchasedOrders = async ({ where, limit, offset }: OrderListParams) => {

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

export const getSoldOrders = async ({ where, limit, offset }: OrderListParams) => {

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

    return {
        ordersList,
        totalPages: Math.ceil(totalCount / limit),
    };
};