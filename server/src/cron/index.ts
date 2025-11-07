import { startCleanWatchHistoryCron } from "./cleanWatchHistory.js";
import { startItemDeleteCron } from "./itemDelete.js";
import { startItemSortDecayCron } from "./itemSortDecay.js";
import { startTokenCron } from "./token.js";
import { startCommentSortDecayCron } from "./commentSortDecay.js";

export const startAllCrons = () => {
    console.log("Starting all cron job...");
    startCleanWatchHistoryCron();
    startItemDeleteCron();
    startItemSortDecayCron();
    startTokenCron();
    startCommentSortDecayCron();
};