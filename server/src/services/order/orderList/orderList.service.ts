import { AppError } from "../../../errors.js";
import { getPurchasedOrders } from "./master/serviceMaster.js";
import { getSoldOrders } from "./master/serviceMaster.js";

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
    if (!handler) throw new AppError("NOT_IMPLEMENTED", 400);

    return await handler({ page, userId, status });
};