import { AppError } from "../../../errors.js";
import { getMePoints } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/current-points
// summary: 現在の所有ポイント取得
// page: /history/points
export const getMePointsUseCase = async ({ userId }: Params) => {
    // user取得
    const user = await getMePoints({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
