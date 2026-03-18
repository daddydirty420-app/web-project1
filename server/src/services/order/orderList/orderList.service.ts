import { getPurchasedOrders } from "./handler.js";
import { getSoldOrders } from "./handler.js";

type Params = {
    type: "purchased" | "sold";
    page: number;
    userId: number;
    status?: string;
};

export const getOrderList = async ({ type, page, userId, status }: Params) => {
    const handlerMap = {
        purchased: getPurchasedOrders,
        sold: getSoldOrders,
    };

    const handler = handlerMap[type];
    if (!handler) throw new Error("NOT_IMPLEMENTED");

    return await handler({ page, userId, status });
};