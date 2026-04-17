import { Op } from 'sequelize';
import { getProfileItemsWithCount } from '../../../services/items/index.js';

type Params = {
    page: number;
    limit: number;
    pageUserId?: number;
};

export const getProfileItemsUseCase = async ({ page, limit, pageUserId }: Params) => {
    const where: any = {
        status: { [Op.in]: ['active', 'soldout'] },
        seller_id: pageUserId,
    };

    const offset = (page - 1) * limit;

    const { items, totalCount } = await getProfileItemsWithCount({ where, limit, offset });

    return {
        items,
        totalPages: Math.ceil(totalCount / limit),
    };
};
