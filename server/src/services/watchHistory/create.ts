import { WatchHistory } from "../../models/index.js";

type Params = {
    itemId: number;
    userId: number | null;
};

export const createWatchHistory = async ({ itemId, userId }: Params) => {
    const nowDate = new Date();

    const history = await WatchHistory.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });

    if (history) {
        history.updatedAt = nowDate;
        await history.save();
    } else {
        await WatchHistory.create({
            item_id: itemId,
            user_id: userId || null,
        });
    }
};