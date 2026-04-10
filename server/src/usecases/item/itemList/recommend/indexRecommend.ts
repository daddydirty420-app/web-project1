import { Op } from "sequelize";
import { getIndexRecommendItems } from "../../../../services/items/index.js";

type Params = {
    userId: number | null;
};

export const getIndexRecommendUseCase = async ({ userId }: Params) => {
    const where: any = {
        status: "active",
        recommend: true,
        ...(userId && { seller_id: { [Op.ne]: userId } }),
    };

    return await getIndexRecommendItems({ where });
};