import { WatchHistory } from "../models/index.js";
import { ItemUserParams } from "../types/serviceType/watchHistory";

type DataParams = {
    history: InstanceType<typeof WatchHistory>;
};

export const findWatchHistory = async ({ itemId, userId }: ItemUserParams) => {
    return WatchHistory.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });
};

export const createWatchHistory = async ({ itemId, userId }: ItemUserParams) => {
    return WatchHistory.create({
        item_id: itemId,
        user_id: userId,
    });
};

export const updateUpdateAt = async ({ history }: DataParams) => {
    const nowDate = new Date();
        
    history.updatedAt = nowDate;
    await history.save();
};

export const destroyWatchHistory = async ({ history }: DataParams) => {
    await history.destroy();
};