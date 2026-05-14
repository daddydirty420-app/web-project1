import { AppError } from "../../../errors.js";
import { getInquiryUser } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/inquiry
// summary: お問い合わせフォーム表示データ取得
// page: /inquiry
export const getInquiryUserUseCase = async ({ userId }: Params) => {
    // user取得
    const user = await getInquiryUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
