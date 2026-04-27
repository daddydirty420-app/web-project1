import { Op } from "sequelize";
import { getIndexItemsWithCount } from "../../../services/items/index.js";

type Params = {
    userId: number | null;
    page: number;
    limit: number;
};

export const getIndexItemsUseCase = async ({ userId, page, limit }: Params) => {
    const where: any = { status: "active" };
    if (userId) {
        where.seller_id = { [Op.ne]: userId };
    }

    const offset = (page - 1) * limit;

    const { items, totalCount } = await getIndexItemsWithCount({ where, limit, offset });

    return {
        items,
        totalPages: Math.ceil(totalCount / limit),
    };
};
