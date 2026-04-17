import { Op } from 'sequelize';
import { getUserItemsUploadedList } from '../../../../services/items/index.js';

type Params = {
    page: number;
    userId: number;
    status?: string;
    keyword?: string;
};

export const getUploadedItemsUseCase = async ({ page, userId, status, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: any = {
        seller_id: userId,
    };

    // status分岐
    if (status) {
        where.status = status;
    } else {
        // デフォルト
        where.status = { [Op.in]: ['active', 'hidden', 'soldout'] };
    }

    if (keyword) {
        where.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const { itemList, totalCount } = await getUserItemsUploadedList({ where, limit, offset });

    return {
        itemList,
        totalPages: Math.ceil(totalCount / limit),
    };
};
