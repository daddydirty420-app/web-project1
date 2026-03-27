import { Follow } from "../../models/index.js";

type Params = {
    currentUserId: number;
    targetUserId: number;
};

export const followStatus = async ({ currentUserId, targetUserId }: Params) => {

    const isFollowing = await Follow.findOne({
        where: {
            follow_user_id: currentUserId,
            follower_user_id: targetUserId,
        },
    });

    return !!isFollowing;
};