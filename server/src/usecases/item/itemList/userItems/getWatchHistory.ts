import { Op } from "sequelize";
import { getUserItemsWatchList } from "../../../../services/watchHistory.js";

type Params = {
    page: number;
    userId: number;
    keyword?: string;
};

export const getUserItemsWatchUseCase = async ({ page, userId, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const itemWhere: any = {
        status: ["active", "soldout"],
    };

    if (keyword) {
        itemWhere.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }
    
    const { itemList, totalCount } = await getUserItemsWatchList({ userId, itemWhere, limit, offset });

    return {
        itemList,
        totalPages: Math.ceil(totalCount / limit),
    };
};