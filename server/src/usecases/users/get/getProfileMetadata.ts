import { AppError } from "../../../errors.js";
import type { User } from "../../../models/user.js";
import { getProfileMetadata } from "../../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /user/:id/profile/metadata
// summary: プロフィールページ メタデータ
// page: /profile/[id]
export const getUserProfileMetadataUseCase = async ({ userId }: Params): Promise<User | null> => {
    const user = await getProfileMetadata({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    return user;
};
