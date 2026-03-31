import { AppError } from "../../errors.js";
import { Follow } from "../../models/index.js";

type Params = {
    currentUserId: number;
    targetUserId: number;
};

export const followDelete = async ({ currentUserId, targetUserId }: Params) => {

    // follow取得
    const follow = await Follow.findOne({
        where: {
            follow_user_id: currentUserId,
            follower_user_id: targetUserId,
        },
    });

    if (!follow) {
        throw new AppError("NOT_LIKE_ITEM", 409, "フォローしていません");
    }

    // follow削除
    await follow.destroy();
};