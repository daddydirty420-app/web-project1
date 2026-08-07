import { AppError } from "../../../errors.js";
import type { User } from "../../../models/user.js";
import { getStar } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/:id/star
// summary: スター数取得
// page: /profileなど
export const getUserStarUseCase = async ({ userId }: Params): Promise<User | null> => {
    const user = await getStar({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
