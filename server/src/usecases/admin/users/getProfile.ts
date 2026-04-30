import { AppError } from "../../../errors.js";
import { getUserPenaltyUriage } from "../../../services/users/query.js";

type Params = {
    pageUserId: number;
};

// GET /admin/user/:id/profile
// summary: 管理者用プロフィールページ データ取得
// page: /profile/admin/[id]
export const getAdminProfileUseCase = async ({ pageUserId }: Params) => {
    // user取得
    const user = await getUserPenaltyUriage({ userId: pageUserId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
