import { Op } from "sequelize";
import { getSoldOrders } from "../../services/orders.js";

type Params = {
    page: number;
    userId: number;
    status?: string;
};

export const getSoldListUseCase = async ({ page, userId, status }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: any = {
        seller_user_id: userId,
    };

    if (status && ["paid", "shipped", "completed"].includes(status)) {
        where.status = status;
    } else {
        where.status = { [Op.ne]: "pending" };
    }

    return await getSoldOrders({ where, limit, offset });
};
