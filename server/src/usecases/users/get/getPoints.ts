import { col, Op, Order, where as sequelizeWhere } from "sequelize";
import { AppError } from "../../../errors.js";
import { getMePointsWithLots } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/current-points
// summary: 現在の所有ポイント取得
// page: /history/points
export const getMePointsUseCase = async ({ userId }: Params) => {
    // PointLots
    // 期限切れに最も近いポイントを取得するwhere
    const whereCondition = {
        [Op.and]: [
            { expires_at: { [Op.lt]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }, //30日後
            sequelizeWhere(col("used_points"), Op.lt, col("points")),
        ],
    };

    const order: Order = [["expires_at", "ASC"]];

    // user取得
    const user = await getMePointsWithLots({ userId, where: whereCondition, order, limit: 1 });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    const plainUser = user.get({ plain: true });

    // 未使用ポイント計算
    if (user.PointLots && user.PointLots.length > 0) {
        const lots = user.PointLots[0];
        const alertPoints = lots.points - lots.used_points;

        plainUser.PointLots = {
            ...lots.get({ plain: true }),
            alertPoints,
        };
    }

    return plainUser;
};
