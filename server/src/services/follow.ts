import { Follow } from "../models/index.js";

type FollowingsParams = {
    currentUserId: number;
    targetUserIds: number[];
};

export const getFollowings = async ({ currentUserId, targetUserIds }: FollowingsParams) => {
    return await Follow.findAll({
        where: {
            follow_user_id: currentUserId,
            follower_user_id: targetUserIds
        },
    }) as InstanceType<typeof Follow>[];
};