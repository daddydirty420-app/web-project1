import { col, Op, Order, where as sequelizeWhere } from "sequelize";
import { AppError } from "../../../errors.js";
import { getMeUriagekinWithLots } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/current-uriagekin
// summary: 現在の所有売上金取得
// page: /history/uriagekin
export const getMeUriagekinUseCase = async ({ userId }: Params) => {
    // UriagekinLots
    // 期限切れに最も近い売上金を取得するwhere
    const whereCondition = {
        [Op.and]: [
            { expires_at: { [Op.lt]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }, //30日後
            sequelizeWhere(col("used_uriagekin"), Op.lt, col("uriagekin")),
        ],
    };

    const order: Order = [["expires_at", "ASC"]];

    // user取得
    const user = await getMeUriagekinWithLots({ userId, where: whereCondition, order, limit: 1 });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    const plainUser = user.get({ plain: true });

    // 未使用売上金計算
    if (user.UriagekinLots) {
        const lots = user.UriagekinLots;
        const alertUriagekin = lots.uriagekin - lots.used_uriagekin;

        plainUser.UriagekinLots = {
            ...lots,
            alertUriagekin,
        };
    }

    return plainUser;
};
