import { AppError } from "../../errors.js";
import { Follow } from "../../models/index.js";

type Params = {
    userId: number;
};

export const followsCount = async ({ userId }: Params) => {
    
    const [followCount, followerCount] = await Promise.all([
        Follow.count({ where: { follow_user_id: userId } }),
        Follow.count({ where: { follower_user_id: userId } }),
    ]);

    if (followCount === null || followerCount === null) {
        throw new AppError("NUMBER_NOT_FOUND", 404);
    }

    return { followCount, followerCount };
};