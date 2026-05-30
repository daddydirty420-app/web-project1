import { Op } from "sequelize";
import { getUserAll } from "../../../services/users/query.js";

type Params = {
    limit: number;
    cursor?: number;
};

export class getAllUserListUseCase {
    async execute({ limit, cursor }: Params) {
        const where = cursor
            ? {
                  id: { [Op.gt]: cursor },
              }
            : {};

        const allUser = await getUserAll({ limit: limit + 1, where });

        const hasMore = allUser.length > limit;

        const slicedAllUser = hasMore ? allUser.slice(0, limit) : allUser;

        const lastItem = slicedAllUser[slicedAllUser.length - 1];

        const nextCursor = lastItem?.id ?? null;

        return { userList: slicedAllUser, nextCursor, hasMore };
    }
}
