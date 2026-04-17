import { createFollow, findFollow } from "../../services/follow.js";
import { AppError } from "../../errors.js";

type Params = {
    currentUserId: number;
    targetUserId: number;
};

export const addFollowUseCase = async ({ currentUserId, targetUserId }: Params) => {
    // follow取得
    const follow = await findFollow({ currentUserId, targetUserId });

    if (follow) {
        throw new AppError("NOT_LIKE_ITEM", 409, "すでにフォローしています");
    }

    // follow作成
    await createFollow({ currentUserId, targetUserId });
};
