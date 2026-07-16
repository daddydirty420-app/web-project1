import { Op, WhereOptions } from "sequelize";

type Params = {
    userId: number;
    limit: number;
    cursor?: string;
};

// GET /uriagekin-history?limit=number(&cursor="")
// summary: 売上金履歴取得
// page: /history/uriagekin
export const getMyUriagekinHistoryUseCase = async ({ userId, limit, cursor }: Params) => {
    // 条件分岐
    const where: WhereOptions = cursor
        ? {
              user_id: userId,
              createdAt: {
                  [Op.lt]: new Date(cursor),
              },
          }
        : {
              user_id: userId,
          };
};
