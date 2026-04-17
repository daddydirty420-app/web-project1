import { findFollow } from "../../services/follow.js";

type Params = {
    currentUserId: number;
    targetUserId: number;
};

export const getFollowStatusUseCase = async ({ currentUserId, targetUserId }: Params) => {
    const isFollowing = await findFollow({ currentUserId, targetUserId });

    return !!isFollowing;
};
