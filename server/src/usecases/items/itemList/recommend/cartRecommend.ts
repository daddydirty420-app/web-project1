import { literal, Op } from "sequelize";
import { AppError } from "../../../../errors.js";
import { getCartRecommendItems } from "../../../../services/items/index.js";

type Params = {
    userId: number | null;
};

export const getCartRecommendUseCase = async ({ userId }: Params) => {
    if (!userId) throw new AppError("INVALID_USER_ID", 401);

    const where: any = {
        status: "active",
        seller_id: { [Op.ne]: userId },
        id: {
            [Op.notIn]: literal(`(
                SELECT "item_id"
                FROM "cart"
                WHERE "user_id" = ${userId}
            )`),
        },
    };

    return await getCartRecommendItems({ where });
};
