import { Op } from "sequelize";
import { getUserItemsStockList } from "../../../../services/items/index.js";

type Params = {
    page: number;
    userId: number;
    keyword?: string;
};

export const getStockItemsUseCase = async ({ page, userId, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: any = {
        seller_id: userId,
        status: { [Op.in]: ["active", "hidden", "soldout"] },
    };

    if (keyword) {
        where.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const { itemList, totalCount } = await getUserItemsStockList({ where, limit, offset });

    return {
        itemList,
        totalPages: Math.ceil(totalCount / limit),
    };
};
