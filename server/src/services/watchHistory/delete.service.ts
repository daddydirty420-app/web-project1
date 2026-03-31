import { AppError } from "../../errors.js";
import { WatchHistory } from "../../models/index.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteWatchHistory = async ({ itemId, userId }: Params) => {

    // watchHistory取得
    const data = await WatchHistory.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });

    if (!data) {
        throw new AppError("WATCH_HISTORY_NOT_FOUND", 404);
    }

    // 削除
    await data.destroy();
};