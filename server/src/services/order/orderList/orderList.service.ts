import { getPurchasedOrders } from "./handler.js";
import { getSoldOrders } from "./handler.js";

type Params = {
    type: "purchased" | "sold";
    page: number;
    userId: number;
    status?: string;
};

export const getOrderList = async ({ type, page, userId, status }: Params) => {
    switch (type) {
        case "purchased": return await getPurchasedOrders({ page, userId, status });
        case "sold": return await getSoldOrders({ page, userId, status });

        default: throw new Error("NOT_IMPLEMENTED");
    }
};