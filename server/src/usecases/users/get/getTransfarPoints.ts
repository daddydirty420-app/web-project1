import { AppError } from "../../../errors.js";
import { getMePointsUriage } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/transfer-points
// summary: ポイント変換ページ　表示データ取得
// page: /transfer/points
export const getUserTransferPointsUseCase = async ({ userId }: Params) => {
    /// user取得
    const user = await getMePointsUriage({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
