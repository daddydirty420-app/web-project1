import { AppError } from "../../../errors.js";
import { getUserTransferRequest } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/transfer-request
// summary: 振込申請ページ　表示データ取得
// page: /transfer/request
export const getUserTransferRequestUseCase = async ({ userId }: Params) => {
    // user取得
    const user = await getUserTransferRequest({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
