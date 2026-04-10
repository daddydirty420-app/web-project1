import { Op } from "sequelize";
import { getPurchasedOrders } from "../../services/orders.js";

type Params = {
    page: number;
    userId: number;
    status?: string;
};

export const getPurchasedListUseCase = async ({ page, userId, status }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: any = {
        buyer_user_id: userId,
    };

    if (status && ["paid", "shipped", "completed"].includes(status)) {
        where.status = status;
    } else {
        where.status = { [Op.ne]: "pending" };
    }

    return await getPurchasedOrders({ where, limit, offset });
};