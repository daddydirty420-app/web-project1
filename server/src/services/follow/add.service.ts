import { AppError } from "../../errors.js";
import { Follow } from "../../models/index.js";

type Params = {
    currentUserId: number;
    targetUserId: number;
};

export const followAdd = async ({ currentUserId, targetUserId }: Params) => {

    // follow取得
    const follow = await Follow.findOne({
        where: {
            follow_user_id: currentUserId,
            follower_user_id: targetUserId,
        },
    });

    if (follow) {
        throw new AppError("NOT_LIKE_ITEM", 409, "すでにフォローしています");
    }

    // follow作成
    await Follow.create({
        follow_user_id: currentUserId,
        follower_user_id: targetUserId,
    });
};