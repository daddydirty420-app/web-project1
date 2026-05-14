import { AppError } from "../../../errors.js";
import { getProfileEditUser } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/profile-edit-data
// summary: プロフィール編集ページ表示データ取得
// page: /edit/profile
export const getProfileEditDataUseCase = async ({ userId }: Params) => {
    const user = await getProfileEditUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
