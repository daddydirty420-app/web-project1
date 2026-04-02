import { createWatchHistory, findWatchHistory, updateUpdateAt } from "../../services/watchHistory.js";

type Params = {
    itemId: number;
    userId: number;
};

export const createWatchHistoryUseCase = async ({ itemId, userId }: Params) => {

    const history = await findWatchHistory({ itemId, userId });

    if (history) {
        updateUpdateAt({ history }).catch((err) => {
            console.error("service WatchHistory updateUpdateAt error:", err);
        })
    } else {
        createWatchHistory({ itemId, userId }).catch((err) => {
            console.error("service WatchHistory createWatchHistory error:", err);
        });
    }
};